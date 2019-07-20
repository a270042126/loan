import storage from '../utils/storage'
const state = {
  isWelcome: false,
  filterParams: '',
  userKeys: storage.get('userKeys'),
  isLoading: false,
  baseUrl: '',
  firstLoad: false,
  projectName: ''
}
export default state
