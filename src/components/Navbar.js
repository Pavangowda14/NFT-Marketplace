import sunlogo from "../light.png";
import moonlogo from "../dark.png";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import "./Navbar.css";
import { ThemeContext } from "../ThemeContext";
import ReactSwitch from "react-switch";
import logo from "../DarkLogo.png";

function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  const { theme, toggleTheme } = useContext(ThemeContext);
  const sunImage = sunlogo;
  const moonImage = moonlogo;

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x5") {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname);
      });
  }

  useEffect(() => {
    if (window.ethereum == undefined) return;
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  });

  return (
    <div className="shadow-2xl  w-screen">
      <nav className="w-screen">
        <ul className="flex items-end justify-between py-3 bg-transparent pr-5">
          <li className="flex items-end ml-20 pb-2">
            <Link to="/">
              <img
                src={logo}
                alt=""
                width={60}
                height={60}
                className="inline-block -mt-2"
              />
              <div className="inline-block font-bold text-xl ml-2 text-2xl ">
                NFT Marketplace
              </div>
            </Link>
          </li>
          <li className="mr-[-300px]">
            <div>
              <ReactSwitch
                checked={theme === "dark"}
                onChange={toggleTheme}
                checkedIcon={
                  <img src={moonImage} alt="Dark Mode" width="24" height="24" />
                }
                uncheckedIcon={
                  <img src={sunImage} alt="Light Mode" width="24" height="24" />
                }
              />
            </div>
          </li>
          <li className="w-1/2">
            <ul className="lg:flex justify-between font-bold text-purple-600 mr-10 text-lg ">
              {location.pathname === "/" ? (
                <li className="border-b-2 hover:pb-0 p-2 ml-10 mr-[-5px]">
                  <Link to="/">Marketplace</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2 ml-10 mr-[-5px] ">
                  <Link to="/">Marketplace</Link>
                </li>
              )}
              {location.pathname === "/sellNFT" ? (
                <li className="border-b-2 hover:pb-0 p-2 ml-[-100px] mr-[-100px]">
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2 ml-[-100px] mr-[-100px]">
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
              )}
              {location.pathname === "/profile" ? (
                <li className="border-b-2 hover:pb-0 p-2 ml-[-2px] mr-[-21px]">
                  <Link to="/profile">Profile</Link>
                </li>
              ) : (
                <li className="hover:border-b-2 hover:pb-0 p-2 ml-[-2px] mr-[-21px]">
                  <Link to="/profile">Profile</Link>
                </li>
              )}
              <li className="mr-[40px]">
                <button
                  className="enableEthereumButton bg-purple-400 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded text-sm"
                  onClick={connectWebsite}
                >
                  {connected ? "Connected" : "Connect Wallet"}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="text-red-500 text-bold text-right mr-10 text-sm">
        {currAddress !== "0x"
          ? "Connected to"
          : "Not Connected. Please login to view NFTs"}{" "}
        {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
      </div>
    </div>
  );
}

export default Navbar;
