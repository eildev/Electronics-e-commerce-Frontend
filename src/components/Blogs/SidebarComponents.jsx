import React from 'react';
import { Link } from 'react-router-dom';



const SearchSidebar = ({ searchQuery, setSearchQuery, setCurrentPage }) => {
    return (
        <div className="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 className="text-xl mb-32 pb-32 border-bottom border-gray-100">
                Search Here
            </h6>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control common-input bg-color-three"
                        placeholder="Search by title, tags, or category..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-main text-2xl h-56 w-56 flex-center text-2xl input-group-text"
                    >
                        <i className="ph ph-magnifying-glass" />
                    </button>
                </div>
            </form>
        </div>
    );
};

const RecentPostsSidebar = ({ posts }) => {
    return (
        <div className="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 className="text-xl mb-32 pb-32 border-bottom border-gray-100">
                Recent Posts
            </h6>
            {posts?.slice(0, 4).map((post) => (
                <div
                    key={post.id}
                    className="d-flex align-items-center flex-sm-nowrap flex-wrap gap-24 mb-16"
                >
                    <Link
                        to={`/blog-details/${post.id}`}
                        className="w-100 h-100 rounded-4 overflow-hidden w-120 h-120 flex-shrink-0"
                    >
                        <img
                            src={`http://127.0.0.1:8000/${post.image}`}
                            alt={post?.title || 'Recent Post'}
                            className="cover-img"
                            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                        />
                    </Link>
                    <div className="flex-grow-1">
                        <h6 className="text-lg">
                            <Link to={`/blog-details/${post.id}`} className="text-line-3">
                                {post?.title}
                            </Link>
                        </h6>
                        <div className="flex-align flex-wrap gap-8">
                            <span className="text-lg text-main-600">
                                <i className="ph ph-calendar-dots" />
                            </span>
                            <span className="text-sm text-gray-500">
                                <Link
                                    to={`/blog-details/${post.id}`}
                                    className="text-gray-500 hover-text-main-600"
                                >
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TagsSidebar = ({ tags, setSelectedCategory, categoryData, searchQuery, setSearchQuery }) => {
    return (
        <div className="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 className="text-xl mb-32 pb-32 border-bottom border-gray-100">
                Tags
            </h6>
            <ul>
                <li className="mb-16">
                    <button
                        className={`flex-between gap-8 w-100 text-gray-700 border border-gray-100 rounded-4 p-4 ps-16 hover-border-main-600 hover-text-main-600 ${!searchQuery && !setSelectedCategory ? 'bg-main-50 text-main-600' : ''}`}
                        onClick={() => {
                            setSelectedCategory(null);
                            setSearchQuery('');
                        }}
                    >
                        <span>All Categories</span>
                        <span className="w-40 h-40 flex-center rounded-4 bg-main-50 text-main-600">
                            <i className="ph ph-arrow-right" />
                        </span>
                    </button>
                </li>
                {tags?.map((tag, index) => (
                    <li key={index} className="mb-16">
                        <button
                            className={`flex-between gap-8 w-100 text-gray-700 border border-gray-100 rounded-4 p-4 ps-16 hover-border-main-600 hover-text-main-600 ${searchQuery === tag.trim() ? 'bg-main-50 text-main-600' : ''}`}
                            onClick={() => {
                                setSelectedCategory(null);
                                setSearchQuery(tag.trim());
                            }}
                        >
                            <span>{tag.trim()}</span>
                            <span className="w-40 h-40 flex-center rounded-4 bg-main-50 text-main-600">
                                <i className="ph ph-arrow-right" />
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const BlogItem = ({ article, isDetail = false }) => {
    return (
        <div className="blog-item">
            <Link
                to={`/blog-details/${article.id}`}
                className="w-100 h-100 rounded-16 overflow-hidden"
            >
                <img
                    src={`http://127.0.0.1:8000/${article.image}`}
                    alt={article?.title || 'Blog Post'}
                    className="cover-img"
                />
            </Link>
            <div className="blog-item__content mt-24">
                <span className="bg-main-50 text-main-600 py-4 px-24 rounded-8 mb-16">
                    {article?.tags || 'Uncategorized'}
                </span>
                <h6 className={isDetail ? 'text-2xl mb-24' : 'text-2xl mb-24'}>
                    <Link to={`/blog-details/${article.id}`} className="">
                        {article?.title}
                    </Link>
                </h6>
                {!isDetail && (
                    <p className="text-gray-700 text-line-2">
                        {article?.desc}
                    </p>
                )}
                <div className="flex-align flex-wrap gap-24 pt-24 mt-24 border-top border-gray-100">
                    <div className="flex-align flex-wrap gap-8">
                        <span className="text-lg text-main-600">
                            <i className="ph ph-calendar-dots" />
                        </span>
                        <span className="text-sm text-gray-500">
                            <Link
                                to={`/blog-details/${article.id}`}
                                className="text-gray-500 hover-text-main-600"
                            >
                                {new Date(article.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </Link>
                        </span>
                    </div>
                    <div className="flex-align flex-wrap gap-8">
                        <span className="text-lg text-main-600">
                            <i className="ph ph-chats-circle" />
                        </span>
                        <span className="text-sm text-gray-500">
                            <Link
                                to={`/blog-details/${article.id}`}
                                className="text-gray-500 hover-text-main-600"
                            >
                                0 Comments
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SearchSidebar, RecentPostsSidebar, TagsSidebar, BlogItem };