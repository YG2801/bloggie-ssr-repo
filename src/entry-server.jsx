import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppRoutes from "./routes";
import { Provider } from "react-redux";
import { createStore } from "./store/store.js";
import appwriteService from "./appwrite/ssr_service";
import appwriteCsrService from "./appwrite/conf_service";
import { Query } from "appwrite";

export async function render(url) {
    const store = createStore();
    const posts = await appwriteService
        .getPosts([Query.equal("status", "active")])
        .then((res) => {
            if (res) {
                return res.documents;
            }
        });
    // console.log(initialPosts)
    const initialPosts = await Promise.all(
        posts.map(async (post) => {
            const imageUrl = appwriteCsrService.getFilePreview(
                post.featuredImage
            );
            // console.log(imageUrl.href);
            return {
                ...post,
                imageUrl: imageUrl,
            };
        })
    );
    const html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={`/${url}`}>
                <AppRoutes initialPosts={initialPosts} />
            </StaticRouter>
        </Provider>
    );

    const preloadedState = store.getState();

    return { html, preloadedState, initialPosts };
}
