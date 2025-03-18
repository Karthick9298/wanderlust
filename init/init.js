import { connect } from "mongoose";
import Listing from "../models/listing.js";
import { data } from "./data.js";

main()
.then(()=>{
    console.log("Connected to db...");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await connect(process.env.ATLASDB_URL);
}

for(let sampleData of data){
    let newListing = sampleData;
    newListing.image.url =sampleData.image.url
    newListing.image.filename = sampleData.image.filename;
    newListing.owner = '67d3ff5370b23b106380bdb8';
    console.log(newListing);
    let listings  = await new Listing(newListing).save();
    console.log(listings);
}

