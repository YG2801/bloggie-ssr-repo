import config from "../config/config"
import { Client, ID, Databases, Storage, Query } from "appwrite"

export class Service {
    client = new Client()
    databases
    storage // or bucket

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId)
        this.databases = new Databases(this.client)
        this.storage = new Storage(this.client)
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionID,
                slug,
                {
                    title,
                    body: content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error :: ", error)
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionID,
                slug,
                {
                    title,
                    body: content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error :: ", error)
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionID,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error :: ", error)
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionID,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getPost :: error :: ", error)
            return false
        }
    }

    async getPosts(queries) {
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionID,
                queries
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error :: ", error)
            return false
        }
    }

    //file services

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                config.appwriteBucketID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error :: ", error)
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(config.appwriteBucketID, fileId)
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error :: ", error)
            return false
        }
    }

    getFilePreview(fileId) {
        return this.storage.getFilePreview(config.appwriteBucketID, fileId)
    }
}

const service = new Service()

export default service
