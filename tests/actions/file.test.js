import './../setup.js'
import { fakeStateWithOneSite } from './../fixtures.js'
import {
  writeFileAndCommit,
  writeFileAndPushChanges,
  deleteFileAndCommit,
  deleteFileAndPushChanges,
} from './../../assets/scripts/actions/file.js'
import gitAgent from './../../assets/scripts/GitAgent.js'
import store from './../../assets/scripts/store.js'

// Use a common sandbox for all tests so we can easily restore it after each test.
const sandbox = sinon.createSandbox()

describe('actions/file.js', () => {
  beforeEach(() => {
    sandbox.stub(store, 'state').value(fakeStateWithOneSite)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('writeFileAndCommit', () => {
    before(() => {
      sandbox.stub(gitAgent, 'writeFile').resolves()
      sandbox.stub(gitAgent, 'commit').resolves()
    })

    it('calls writeFile and commit', done => {
      writeFileAndCommit('test.js', 'Curiouser and curiouser!')
        .then(() => {
          expect(gitAgent.writeFile).to.have.been.calledWith(
            store.state.currentRepository,
            'test.js',
            'Curiouser and curiouser!',
          )
          expect(gitAgent.commit).to.have.been.calledWith(
            store.state.currentRepository,
            'Modification du fichier test.js',
          )
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('writeFileAndPushChanges', () => {
    before(() => {
      sandbox.stub(gitAgent, 'writeFile').resolves()
      sandbox.stub(gitAgent, 'commit').resolves()
      sandbox.stub(gitAgent, 'safePush').resolves()
    })

    it('calls writeFile, commit and push', done => {
      writeFileAndPushChanges('test.js', 'Curiouser and curiouser!')
        .then(() => {
          expect(gitAgent.writeFile).to.have.been.calledWith(
            store.state.currentRepository,
            'test.js',
            'Curiouser and curiouser!',
          )
          expect(gitAgent.commit).to.have.been.calledWith(
            store.state.currentRepository,
            `Modification du fichier test.js`,
          )
          expect(gitAgent.safePush).to.have.been.calledWith(
            store.state.currentRepository,
          )
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('deleteFileAndCommit', () => {
    before(() => {
      sandbox.stub(gitAgent, 'removeFile').resolves()
      sandbox.stub(gitAgent, 'commit').resolves()
    })

    it('calls removeFile and commit', done => {
      deleteFileAndCommit('test.js')
        .then(() => {
          expect(gitAgent.removeFile).to.have.been.calledWith(
            store.state.currentRepository,
            'test.js',
          )
          expect(gitAgent.commit).to.have.been.calledWith(
            store.state.currentRepository,
            'Suppression du fichier test.js',
          )
          done()
        })
        .catch(e => done(e))
    })
  })

  describe('deleteFileAndPushChanges', () => {
    before(() => {
      sandbox.stub(gitAgent, 'removeFile').resolves()
      sandbox.stub(gitAgent, 'commit').resolves()
      sandbox.stub(gitAgent, 'safePush').resolves()
    })

    it('calls removeFile and commit', done => {
      deleteFileAndPushChanges('test.js')
        .then(() => {
          expect(gitAgent.safePush).to.have.been.calledWith(
            store.state.currentRepository,
          )
          done()
        })
        .catch(e => done(e))
    })
  })
})
