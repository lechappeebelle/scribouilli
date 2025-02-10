import '../setup.js'
import { file } from '../../assets/scripts/actions/file.js'
import { saveCustomCSS } from '../../assets/scripts/actions/current-repository.js'
import { CUSTOM_CSS_PATH } from '../../assets/scripts/config.js'

describe('actions/current-repository.js', () => {
  describe('saveCustomCSS', () => {
    it('calls writeFile, commit and safePush', done => {
      const fakeStore = {
        mutations: {
          setTheme: sinon.stub(),
        },
        state: {
          buildStatus: {
            setBuildingAndCheckStatusLater: sinon.stub(),
          },
        },
      }
      sinon.stub(file, 'writeFileAndPushChanges')
      const css = 'body{ background: pink; }'

      saveCustomCSS(css, fakeStore)

      expect(file.writeFileAndPushChanges).to.have.been.calledWithExactly(
        CUSTOM_CSS_PATH,
        css,
        'mise à jour du fichier de styles custom',
      )

      done()
    })
  })
})
