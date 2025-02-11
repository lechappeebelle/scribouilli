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
    it('calls writeFile and commit', done => {
      const fakeStore = {
        state: {
          gitAgent: {
            writeFile: sinon.stub(),
            commit: sinon.stub(),
          },
        },
      }
      writeFileAndCommit(
        'test.js',
        'Curiouser and curiouser!',
        undefined,
        fakeStore,
      )
      done()
      expect(fakeStore.state.gitAgent.writeFile).to.have.been.calledWith(
        'bla',
        'test.js',
        'Curiouser and curiouser!',
      )
      expect(faceStore.state.gitAgent.commit).to.have.been.calledWith(
        'fanne',
        'Modification du fichier test.js',
      )
    })
  })

  describe('writeFileAndPushChanges', () => {
    it('calls writeFile, commit and push', done => {
      const fakeStore = {
        state: {
          gitAgent: {
            removeFile: sinon.stub(),
            commit: sinon.stub(),
          },
        },
      }
      writeFileAndPushChanges(
        'test.js',
        'Curiouser and curiouser!',
        undefined,
        fakeStore,
      )
      done()
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
    })
  })

  describe('deleteFileAndCommit', () => {
    it('calls removeFile and commit', done => {
      const fakeStore = {
        state: {
          gitAgent: {
            removeFile: sinon.stub(),
            commit: sinon.stub(),
          },
        },
      }

      deleteFileAndCommit('test.js', undefined, fakeStore)
      done()
      expect(fakeStore.state.gitAgent.removeFile).to.have.been.calledOnce
      expect(fakeStore.state.gitAgent.commit).to.have.been.calledOnce
    })
  })

  describe('deleteFileAndPushChanges', () => {
    it('calls removeFile and commit', done => {
      const fakeStore = {
        state: {
          gitAgent: {
            removeFile: sinon.stub(),
            safePush: sinon.stub(),
            commit: sinon.stub(),
          },
        },
      }
      deleteFileAndPushChanges('test.js', undefined, fakeStore)
      expect(fakeStore.state.gitAgent.safePush).to.have.been.calledOnce
      done()
    })
  })
})
