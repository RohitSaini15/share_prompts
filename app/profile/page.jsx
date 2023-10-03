'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile"

const MyProfile = () => {
    const [posts,setPosts] = useState([])
    const {data: session} = useSession()
    const router = useRouter()

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${session?.user.id}/posts`)
            const data = await response.json()

            setPosts(data)
        }

        console.log(session?.user.id)

        if(session?.user.id){
            fetchPosts()
        }
    },[session])

    const handleEdit = (post) => {
        router.push(`update-prompt?id=${post._id}`)
    }

    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

        if(hasConfirmed){
            try{
                await fetch(`/api/prompt/${post._id}`,{
                    method: 'DELETE'
                })

                const filterPosts = posts.filter(p => p._id !== post._id)
                setPosts(filterPosts)
            } catch(err){
                console.log(err)
            }
        }
    }

  return (
    <Profile
        name = "My"
        desc = "Welcome to your personalized profile page"
        data = {posts}
        handleEdit = {handleEdit}
        handleDelete = {handleDelete}
    />
  )
}

export default MyProfile