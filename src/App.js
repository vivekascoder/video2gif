import { useState, useEffect, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { CloudUploadIcon, XIcon, CogIcon } from "@heroicons/react/solid";

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [videoSource, setVideoSource] = useState("");
  const [ready, setReady] = useState(false);
  const [gif, setGif] = useState("");
  const [showModal, setShowModal] = useState(false);
  const uploadButton = useRef(null);

  const load = async () => {
    console.log('Loading the ffmpeg code library....')
    await ffmpeg.load();
    console.log('Loaded...')
    setReady(true);
  };

  const convertToGif = async () => {
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(videoSource));
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "2.5",
      "-ss",
      "2.0",
      "-f",
      "gif",
      "out.gif"
    );
    const data = ffmpeg.FS("readFile", "out.gif");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-800">
      {ready ? (
        <div className="relative">
          {/* Modal for showinf messages... */}
          <div
            className={`
          absolute top-0 right-0 m-2 
          bg-gradient-to-br from-yellow-400
          via-red-500 to-pink-500 rounded-sm
          w-96 shadow-md ${showModal ? "block" : "hidden"}
        `}
          >
            <div className="px-4 py-6 relative">
              <button
                className="absolute top-0 right-0 my-1 mr-1 p-1 hover:bg-gray-200 hover:bg-opacity-20 rounded-sm outline-none"
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                <XIcon className="w-4 h-4 text-white" />
              </button>
              <p className="font-semibold text-white">
                Hello, World this is random message, This is another line to
                make the content really big.
              </p>
            </div>
          </div>

          {/* Navbar Goes Here... */}
          <nav className="bg-gray-900 flex justify-center mb-8">
            <h1
              className="
            font-bold
            uppercase
            bg-gradient-to-r 
            from-yellow-400 
            via-red-500 
            to-pink-500 
            text-2xl 
            inline-block 
            text-transparent
            p-4 
            bg-clip-text
          "
            >
              Video To Gif
            </h1>
          </nav>

          {/* Main Body Content Goes Here... */}
          <section className="container mx-auto">
            <div className="h-40">
              <input
                type="file"
                className="hidden"
                ref={uploadButton}
                onChange={(e) => {
                  setVideoSource(e.target.files?.item(0));
                }}
              />
              <div className="flex items-center justify-center">
                <p className="text-lg text-white font-semibold">
                  Upload a Video File Here to convert:
                </p>
                <button
                  className="
                flex space-x-2 items-center bg-green-500 px-4 py-2
                font-semibold uppercase text-xs ml-3 text-white transition 
                transform hover:-translate-y-0.5"
                  onClick={() => {
                    uploadButton.current.click();
                  }}
                >
                  <span>Select Video</span>
                  <CloudUploadIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Showing the Video and Gif Section */}
          <section className="flex items-center container mx-auto space-x-4">
            <div className="w-1/2">
              {videoSource ? (
                <video
                  controls
                  src={URL.createObjectURL(videoSource)}
                  className="w-full"
                ></video>
              ) : (
                ""
              )}
            </div>
            <div className="w-1/2">
              {gif ? 
              <a href={gif} download={'output.gif'}>
                <img src={gif} className="w-full" />
              </a> : ""}
            </div>
          </section>

          {/* Showing the Convert Button... */}
          {videoSource ? (
            <section className="flex justify-center mt-10">
              <button
                className="
                flex space-x-2 items-center bg-red-500 px-4 py-2
                font-semibold uppercase text-xs ml-3 text-white transition 
                transform hover:-translate-y-0.5"
                onClick={convertToGif}
              >
                <span>Convert</span>
                <CogIcon className="w-4 h-4" />
              </button>
            </section>
          ) : (
            ""
          )}
        </div>
      ) : (
        <p>Loading..</p>
      )}
    </div>
  );
}

export default App;
