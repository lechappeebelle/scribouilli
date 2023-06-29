//@ts-check

import lireFrontMatter from "front-matter";

import { handleErrors } from "./utils.js";
import { fetchAuthenticatedUserLogin } from "./actions.js";
import store from "./store.js";

class DatabaseAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.commitsEtag = undefined;
    this.latestCommit = undefined;
    this.getFilesCache = new Map();
    this.fileCached = undefined;
    this.customCSSPath = "assets/css/custom.css";
    this.defaultRepoOwner = "Scribouilli";
    this.defaultThemeRepoName = "site-template";
  }

  getAuthenticatedUser() {
    return this.callGithubAPI("https://api.github.com/user").then(
      (response) => {
        return response.json();
      }
    );
  }

  getRepository(login, repoName) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((msg) => {
        if (msg === "NOT_FOUND") {
          throw "REPOSITORY_NOT_FOUND";
        }

        throw msg;
      });
  }

  getCurrentUserRepositories() {
    return this.callGithubAPI(
      `https://api.github.com/user/repos?sort=updated&affiliation=owner&visibility=public`
    ).then((response) => {
      return response.json();
    });
  }

  async createDefaultRepository(login, newRepoName) {
    let res = await this.callGithubAPI(
      `https://api.github.com/repos/${this.defaultRepoOwner}/${this.defaultThemeRepoName}/generate`,
      {
        headers: {
          Authorization: "token " + this.accessToken,
          Accept: "application/vnd.github+json",
        },
        method: "POST",
        body: JSON.stringify({
          owner: login,
          name: newRepoName,
          description: "Mon site Scribouilli",
        }),
      }
    );

    let test = await this.callGithubAPI(
      `https://api.github.com/repos/${login}/${newRepoName}/topics`,
      {
        headers: {
          Authorization: "token " + this.accessToken,
          Accept: "application/vnd.github+json",
        },
        method: "PUT",
        body: JSON.stringify({
          owner: login,
          repo: newRepoName,
          names: ["site-scribouilli"],
        }),
      }
    );
    console.log(test);
    return res;
  }

  createRepoGithubPages(account, repoName) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${account}/${repoName}/pages`,
      {
        headers: {
          Authorization: "token " + this.accessToken,
          Accept: "applicatikn/vnd.github+json",
        },
        method: "POST",
        body: JSON.stringify({ source: { branch: "main" } }),
      }
    );
  }

  /**
   * @summary Get file informations
   * @param {string} login
   * @param {string} repoName
   * @param {string} fileName
   * @returns
   */
  getFile(login, repoName, fileName) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}/contents/${fileName}`,
      {
        headers: {
          Authorization: "token " + this.accessToken,
          "If-None-Match": this.getFilesCache.get(fileName)?.etag,
        },
      }
    ).then((httpResp) => {
      if (httpResp.status !== 304) {
        const file = httpResp.json();
        this.getFilesCache.set(fileName, {
          etag: httpResp.headers.get("etag"),
          file: file,
        });
      }
      return this.getFilesCache.get(fileName).file;
    });
  }

  getGitHubPagesSite(login, repoName) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}/pages`
    ).then((response) => {
      return response.json();
    });
  }

  getDeploymentStatus(deployment) {
    return this.callGithubAPI(deployment.statuses_url).then((response) => {
      return response.json();
    });
  }

  /**
   * @summary Remove file from github
   */
  deleteFile(login, repoName, fileName, sha) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}/contents/${fileName}`,
      {
        headers: { Authorization: "token " + this.accessToken },
        method: "DELETE",
        body: JSON.stringify({
          sha,
          message: `suppression du fichier ${fileName}`,
        }),
      }
    ).then((response) => {
      return response.json();
    });
  }

  deleteRepository(login, repoName) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}`,
      {
        headers: { Authorization: "token " + this.accessToken },
        method: "DELETE",
      }
    );
  }

  /**
   * @summary Create a file
   *
   * @param {{ message: string, content: string, }} body
   */
  createFile(login, repoName, fileName, body) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}/contents/${fileName}`,
      {
        headers: { Authorization: "token " + this.accessToken },
        method: "PUT",
        body: JSON.stringify(body),
      }
    );
  }

  createCustomCSS(login, repoName, content) {
    return this.createFile(login, repoName, this.customCSSPath, {
      message: "création du ficher de styles custom",
      content: Buffer.from(content).toString("base64"),
    });
  }

  /**
   * @summary Update a file
   *
   * On supprime la référence correspondante à l'ancien nom
   * Nous ne pouvons pas renommer le fichier via l'API
   * https://stackoverflow.com/questions/31563444/rename-a-file-with-github-api
   *
   * @param {string} login
   * @param {string} repoName
   * @param {string} oldfileName Name of the file
   * @param {string} newFileName Name of the file after modification
   * @param {*} body
   * @param {string} sha Sha of the file generated by Github
   * @returns
   *
   */
  updateFile(login, repoName, oldfileName, newFileName, body, sha) {
    if (newFileName === oldfileName) {
      body.sha = sha;

      return this.callGithubAPI(
        `https://api.github.com/repos/${login}/${repoName}/contents/${oldfileName}`,
        {
          headers: { Authorization: "token " + this.accessToken },
          method: "PUT",
          body: JSON.stringify(body),
        }
      );
    } else {
      return this.deleteFile(login, repoName, oldfileName, sha).then(() => {
        return this.createFile(login, repoName, newFileName, body);
      });
    }
  }

  updateCustomCSS(login, repoName, content, sha) {
    return this.updateFile(
      login,
      repoName,
      this.customCSSPath,
      this.customCSSPath,
      {
        content: Buffer.from(content).toString("base64"),
        message: "mise à jour du thème",
      },
      sha
    ).then((response) => {
      return response.json();
    });
  }

  getLatestCommit(login, repoName) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}/commits`,
      {
        headers: {
          Authorization: "token " + this.accessToken,
          "If-None-Match": this.commitsEtag,
        },
      }
    )
      .then((httpResp) => {
        if (httpResp.status === 304) {
          return [this.latestCommit];
        } else {
          this.commitsEtag = httpResp.headers.get("etag");
          return httpResp.json();
        }
      })
      .then((commits) => {
        this.latestCommit = commits[0];
        return this.latestCommit;
      });
  }

  getPagesList(login, repoName) {
    return this.getLatestCommit(login, repoName).then(({ sha }) => {
      return this.callGithubAPI(
        `https://api.github.com/repos/${login}/${repoName}/git/trees/${sha}`
      )
        .then((response) => response.json())
        .then(({ tree }) => {
          const pageFiles = tree.filter((f) => {
            return (
              f.type === "blob" &&
              (f.path.endsWith(".md") || f.path.endsWith(".html"))
            );
          });
          return pageFiles;
        })
        .then((files) => {
          const pagePs = files.map((file) => {
            return this.getFile(login, repoName, file.path)
              .then((page) => {
                const { attributes: data, body: markdownContent } =
                  lireFrontMatter(
                    Buffer.from(page.content, "base64").toString()
                  );
                const title = data?.title;
                return {
                  title: title,
                  path: file.path,
                  content: markdownContent,
                };
              })
              .catch(() => {
                return { title: file.path, path: file.path, content: "" };
              });
          });
          return Promise.all(pagePs);
        });
    });
  }

  getArticlesList(login, repoName) {
    return this.getLatestCommit(login, repoName).then((_) => {
      return this.callGithubAPI(
        `https://api.github.com/repos/${login}/${repoName}/contents/_posts`
      )
        .then((response) => response.json())
        .then((articles) => {
          return articles.filter((f) => {
            return (
              f.type === "file" &&
              (f.path.endsWith(".md") || f.path.endsWith(".html"))
            );
          });
        })
        .then((files) => {
          const articlePs = files.map((file) => {
            return this.getFile(login, repoName, file.path)
              .then((article) => {
                const { attributes: data, body: markdownContent } =
                  lireFrontMatter(
                    Buffer.from(article.content, "base64").toString()
                  );
                const title = data?.title;
                return {
                  title: title,
                  path: file.path,
                  content: markdownContent,
                };
              })
              .catch(() => {
                return { title: file.path, path: file.path, content: "" };
              });
          });
          return Promise.all(articlePs);
        });
    });
  }

  getLastDeployment(login, repoName) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}/deployments?per_page=1`
    ).then((deployments) => deployments[0]);
  }

  checkFileExistence(login, repoName, path) {
    return this.callGithubAPI(
      `https://api.github.com/repos/${login}/${repoName}/contents/${path}`,
      {
        headers: {
          Authorization: "token " + this.accessToken,
          "If-None-Match": this.getFilesCache.get(path)?.etag,
        },
      }
    )
      .then((httpResp) => httpResp.status !== 404)
      .catch((_) => false);
  }

  /**
   * @summary This method must be called for each API call.
   *
   * It handles access_token errors
   *
   */
  callGithubAPI(
    url,
    requestParams = { headers: { Authorization: "token " + this.accessToken } }
  ) {
    return fetch(url, requestParams).then((httpResp) => {
      if (httpResp.status === 404) {
        throw "NOT_FOUND";
      }

      if (httpResp.status === 401) {
        this.accessToken = undefined;
        console.debug("this accessToken : ", this);
        throw "INVALIDATE_TOKEN";
      }
      return httpResp;
    });
  }
}

let databaseAPI;

// Create the databaseAPI singleton with the logged-in user access token.
if (store.state.accessToken) {
  databaseAPI = new DatabaseAPI(store.state.accessToken);
} else {
  history.replaceState(undefined, "", store.state.basePath + "/");
}

export default databaseAPI;
