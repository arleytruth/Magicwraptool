/* eslint-disable react/no-unescaped-entities */
const ErrorNoHomePage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-gray-600">
      <h1 className="text-2xl text-red-600 font-semibold mb-8">
        Warning: there is no page with a "/" slug.
      </h1>
      <p className="mb-6">
        Please, create a page in the editor with a slug "/" that will be your
        home page.
      </p>
    </div>
  )
}

export default ErrorNoHomePage
