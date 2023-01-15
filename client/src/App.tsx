import { useCallback, FC, useEffect } from "react";
import { io } from "socket.io-client";
import MulterUploader from "./MutlterUploader";
const socket = io("http://localhost:3001");
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

let App: FC = () => {
  let sendMessage = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      console.log("inside Message handler");
      socket.emit("sent_message", { data: "Message Sent" });
    },
    []
  );

  useEffect(() => {
    socket.on("brodcast_message", ({ data }) => {
      console.log(data);
      alert(data);
    });
  }, [socket]);

  return (
    <>
      <div className="flex  justify-center mt-10">
        <input
          type="text"
          placeholder="type message..."
          className="text border-[2px] border-blue-300 border-blue pl-2"
        />
        <button
          className="p-4 bg-black text-white font-bold"
          onClick={sendMessage}
        >
          Send Mesage
        </button>
      </div>
      <MulterUploader />
    </>
  );
};

export default App;
