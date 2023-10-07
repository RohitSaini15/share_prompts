'use client';
import { useEffect, useState } from "react";
import PromptCard from "./PromptCard"

const PromptCardList = ({data, handleTagClick}) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map(post => (
                <PromptCard
                    key = {post._id}
                    post = {post}
                    handleTagClick = {handleTagClick}
                />
            ))}
        </div>
    )
}

const Feed = () => {
    const [searchText,setSearchText] = useState('')
    const [timeout,setTimeout] = useState(null)
    const [searchResults,setSearchResults] = useState([])

    const [posts,setPosts] = useState([])

    const filterPrompts = (searchText) => {
        const regexp = new RegExp(searchText,'i')
        return posts.filter((post) => {
            return regexp.test(post.creator.username) || regexp.test(post.tag) || regexp.test(post.prompt)
        })
    }

    const handleSearchChange = (e) => {
        clearInterval(timeout)
        setSearchText(e.target.value)
        setTimeout(() => {
            const data = filterPrompts(e.target.value)
            setSearchResults(data)
        },500)
    }

    const handleTagClick = (tag) => {
        setSearchText(tag)

        const data = filterPrompts(tag)
        setSearchResults(data)
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch("/api/prompt");
            const data = await response.json()
            setPosts(data)
        }
        
        fetchPosts()
    },[])

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type = "text"
                    placeholder = "Search for a tag or username"
                    value = {searchText}
                    onChange = {handleSearchChange}
                    required
                    className = "search_input peer"
                />
            </form>
            {
                searchText ? (
                    <PromptCardList
                        data = {searchResults}
                        handleTagClick = {handleTagClick}
                    />
                ) : (
                    <PromptCardList
                        data = {posts}
                        handleTagClick = {handleTagClick}
                    />
                )
            }
            
        </section>
    )
}

export default Feed