import Navbar from "./Navbar";
import { Link, useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function NFTPage(props) {
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");
  const [isListedOnMarketplace, setIsListedOnMarketplace] = useState(false);

  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    var tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);

    const isNFTListed = listedToken[4];
    setIsListedOnMarketplace(isNFTListed);
    console.log("listedToken:", listedToken);
    console.log("isNFTListed:", isNFTListed);

    meta = meta.data;
    console.log(listedToken);

    let item = {
      price: ethers.utils.formatUnits(listedToken.price.toString(), "ether"),
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr);
  }

  const params = useParams();
  const tokenId = params.tokenId;

  useEffect(() => {
    getNFTData(tokenId);
  }, [tokenId]);

  useEffect(() => {
    getNFTData(tokenId);
  }, [isListedOnMarketplace]);

  if (typeof data.image == "string")
    data.image = GetIpfsUrlFromPinata(data.image);

  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");

      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  console.log("isListedOnMarketplace:", isListedOnMarketplace);
  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20">
        <img
          src={data.image}
          alt=""
          className="w-2/5"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)" }}
        />
        <div
          className="text-xl ml-20 space-y-8 rounded-lg p-5"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)" }}
        >
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>
            Price: <span className="">{data.price + " ETH"}</span>
          </div>
          <div>
            Owner: <span className="text-sm">{data.owner}</span>
          </div>
          <div>
            Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            {currAddress !== data.owner && currAddress !== data.seller ? (
              <button
                className="enableEthereumButton bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={() => buyNFT(tokenId)}
              >
                Buy this NFT
              </button>
            ) : !isListedOnMarketplace ? (
              <Link to={`/resellNFT/${tokenId}`}>
                <button className="enableEthereumButton bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded text-sm">
                  List on Marketplace
                </button>
              </Link>
            ) : (
              <p>You're the owner</p>
            )}

            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
