import { BrowserRouter as Router, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";
import { ThemeContext } from "../ThemeContext";
import { useContext } from "react";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };

  const { theme } = useContext(ThemeContext);

  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <Link to={newTo}>
      <div
        className=" ml-12 mt-5 mb-12  flex flex-col items-center rounded-lg w-48 md:w-72  relative "
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)" }}
      >
        <img
          src={IPFSUrl}
          alt=""
          className="w-72 h-80 rounded-lg object-cover"
        />
        <div
          id={theme}
          className="bg-black text-white w-full p-2 flex justify-between items-center pt-5 mt-10 absolute bottom-0 left-0"
        >
          <strong className="text-xl">{data.data.name}</strong>
          <p className="display-inline ml-2 m-0">{data.data.price} ETH</p>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
