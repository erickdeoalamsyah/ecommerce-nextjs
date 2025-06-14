const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
})

module.exports = {
  useRouter,
}