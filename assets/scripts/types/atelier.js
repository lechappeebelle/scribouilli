/**
 * @typedef {Object} Page
 * @property {string} path
 * @property {string} title
 * @property {string} [content]
 * @property {boolean} [inMenu]
 * @property {boolean} [blogIndex] Is this page the index of the blog section? Defaults to false.
 * @property {number} index
 */

/**
 * @typedef {Object} Article
 * @property {string} path
 * @property {string} title
 * @property {string} [content]
 */

/**
 * @typedef {Object} EditeurFile
 * @property {string} fileName
 * @property {string} content
 * @property {string | undefined} previousContent
 * @property {string} title
 * @property {number} index
 * @property {string | undefined} previousTitle
 * @property {boolean} blogIndex
 */

/**
 * @typedef {Object} FileContenu
 * @property {string} path
 * @property {string} title
 * @property {string} content
 * @property {number} index
 * @property {boolean} inMenu
 * @property {boolean} blogIndex
 */
