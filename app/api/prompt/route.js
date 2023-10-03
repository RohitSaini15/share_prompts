import Prompt from "@models/prompt";
import {connectToDB} from "@utils/database"

export const GET = async () => {
    try{
        await connectToDB();
        const response = await Prompt.find({}).populate('creator')
    
        return new Response(JSON.stringify(response),{
            status: 200
        })
    } catch(err){
        console.log(err)
        return new Response("Unable to fetch data",{
            status: 500
        })
    }
}