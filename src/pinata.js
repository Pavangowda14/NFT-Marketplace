require("dotenv").config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;

const axios = require("axios");
const FormData = require("form-data");

export const uploadJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //making axios POST request to Pinata ⬇️

  let data = new FormData();
  data.append("file", file);

  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      console.log("image uploaded", response.data.IpfsHash);
      return {
        success: true,
        pinataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const updateMetadataToIPFS = async (tokenURI, newResellPrice) => {
  try {
    // Step 1: Retrieve the existing metadata from IPFS using the tokenURI
    console.log(tokenURI, newResellPrice);
    const existingMetadata = await axios.get(tokenURI);
    const existingMetadataObject = existingMetadata.data;
    console.log(tokenURI, newResellPrice);
    // Step 2: Update the resell price in the existing metadata
    existingMetadataObject.price = newResellPrice;

    // Step 3: Create the updated metadata JSON
    const updatedMetadata = JSON.stringify(existingMetadataObject);

    // Step 4: Upload the updated metadata to IPFS
    const metadataResponse = await uploadJSONToIPFS(updatedMetadata);
    if (metadataResponse.success) {
      return metadataResponse.pinataURL;
    } else {
      throw new Error("Error updating metadata to IPFS");
    }
  } catch (error) {
    console.error("Error updating metadata to IPFS:", error);
    throw error;
  }
};
