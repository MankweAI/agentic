import NavBar from "@/components/navbar";

export default async function Terms() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8 xl:p-10 bg-white rounded-lg shadow-lg">
        <div className="m-8 w-full flex justify-between">
          <header className="w-auto"></header>

          <h1 className="text-2xl w-full flex justify-center font-bold text-[#C60D69]">
            Terms Of Use
          </h1>
          <header className="w-auto text-xs mr-4">Updated: 2024/08/20</header>
        </div>

        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">
            30 Days Free Trial
          </h1>
          <hr className="border-1 border-[#C60D69]" />
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">Contracts</h1>
          <hr className="border-1 border-[#C60D69]" />
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">Premiums</h1>
          <hr className="border-1 border-[#C60D69]" />
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">Information Security</h1>
          <hr className="border-1 border-[#C60D69]" />
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">Cancellations</h1>
          <hr className="border-1 border-[#C60D69]" />
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      {/* <footer className="w-full flex justify-center"> this is a footer</footer> */}
    </>
  );
}
