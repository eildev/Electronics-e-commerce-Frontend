import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { SearchSidebar, RecentPostsSidebar, TagsSidebar, BlogItem } from './SidebarComponents';
import { useGetBlogQuery } from '../../redux/features/api/blogApi';

const BlogDetails = () => {
    const { id } = useParams();
    const { data, isLoading, isError } = useGetBlogQuery();

    if (isLoading) {
        return <div className="text-center mt-10">Loading blog details...</div>;
    }

    if (isError) {
        return <div className="text-center mt-10 text-red-500">Failed to load blog details. Please try again later.</div>;
    }

    const blog = data?.blogPost?.find((post) => post.id === parseInt(id));

    if (!blog) {
        return <div className="text-center mt-10 text-red-500">Blog not found.</div>;
    }

    const sortedBlogs = data?.blogPost
        ?.slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const tags = data?.blogPost
        ?.flatMap((post) => post.tags?.split(',') || [])
        .filter((tag, index, self) => self.indexOf(tag) === index);

    return (
        <section className="blog-details py-80">
            <div className="container container-lg">
                <div className="row gy-5">
                    <div className="col-lg-8 pe-xl-4">
                        <div className="blog-item-wrapper">
                            <BlogItem article={blog} isDetail={true} />
                        </div>
                        <div className="mt-48">
                            {/* <div className="row gy-4">
                                <div className="col-sm-6 col-xs-6">
                                    <img
                                        src="/placeholder-image.jpg"
                                        alt="Blog Detail Image 1"
                                        className="rounded-16"
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-6">
                                    <img
                                        src="/placeholder-image.jpg"
                                        alt="Blog Detail Image 2"
                                        className="rounded-16"
                                    />
                                </div>
                            </div> */}
                        </div>
                        <div className="mt-48">
                            <p className="text-gray-700 mb-24">{blog?.desc}</p>
                        </div>
                        <div className="mt-48">
                            <h6 className="mb-32">
                                The following are the four main market segments in which e-commerce
                                is present. These are the following:
                            </h6>
                            <div className="row gy-4">
                                <div className="col-sm-6">
                                    <ul>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0">
                                                <i className="ph ph-check" />
                                            </span>
                                            <span className="text-gray-700 flex-grow-1">
                                                {blog?.desc.split('.')[0] || 'A great commerce experience...'}
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0">
                                                <i className="ph ph-check" />
                                            </span>
                                            <span className="text-gray-700 flex-grow-1">
                                                {blog?.desc.split('.')[1] || 'A great commerce experience...'}
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-0">
                                            <span className="text-xl d-flex flex-shrink-0">
                                                <i className="ph ph-check" />
                                            </span>
                                            <span className="text-gray-700 flex-grow-1">
                                                {blog?.desc.split('.')[2] || 'A great commerce experience...'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-sm-6">
                                    <ul>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0">
                                                <i className="ph ph-check" />
                                            </span>
                                            <span className="text-gray-700 flex-grow-1">
                                                {blog?.desc.split('.')[3] || 'A great commerce experience...'}
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-20">
                                            <span className="text-xl d-flex flex-shrink-0">
                                                <i className="ph ph-check" />
                                            </span>
                                            <span className="text-gray-700 flex-grow-1">
                                                {blog?.desc.split('.')[4] || 'A great commerce experience...'}
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-start gap-8 mb-0">
                                            <span className="text-xl d-flex flex-shrink-0">
                                                <i className="ph ph-check" />
                                            </span>
                                            <span className="text-gray-700 flex-grow-1">
                                                {blog?.desc.split('.')[5] || 'A great commerce experience...'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="mt-48">
                            <div className="rounded-16 bg-main-50 p-24">
                                <span className="w-48 h-48 bg-main-600 text-white flex-center rounded-circle mb-24 text-2xl">
                                    <i className="ph ph-quotes" />
                                </span>
                                <p className="text-gray-700 mb-24">{blog?.desc}</p>
                                <div className="flex-align gap-8">
                                    <span className="text-15 fw-medium text-neutral-600 d-flex">
                                        <i className="ph-fill ph-star" />
                                    </span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex">
                                        <i className="ph-fill ph-star" />
                                    </span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex">
                                        <i className="ph-fill ph-star" />
                                    </span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex">
                                        <i className="ph-fill ph-star" />
                                    </span>
                                    <span className="text-15 fw-medium text-neutral-600 d-flex">
                                        <i className="ph-fill ph-star" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-48">
                            <div className="flex-align gap-8">
                                <h6 className="mb-0">Tag:</h6>
                                <Link
                                    to="/shop"
                                    className="border border-gray-100 rounded-4 py-6 px-8 hover-bg-gray-100 text-gray-900"
                                >
                                    {blog?.tags.split(',')[0] || 'Gadget'}
                                </Link>
                                {blog?.tags.split(',').slice(1).map((tag, index) => (
                                    <Link
                                        key={index}
                                        to="/shop"
                                        className="border border-gray-100 rounded-4 py-6 px-8 hover-bg-gray-100 text-gray-900"
                                    >
                                        {tag.trim()}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="my-48">
                            <span className="border-bottom border-gray-100 d-block" />
                        </div>
                        <div className="my-48 flex-between flex-sm-nowrap flex-wrap gap-24">
                            <div className="">
                                <button
                                    type="button"
                                    className="mb-20 h6 text-gray-500 text-lg fw-normal hover-text-main-600"
                                >
                                    Previous Post
                                </button>
                                <h6 className="text-lg mb-0">
                                    <Link to="/blog-details" className="">
                                        Previous Blog Title
                                    </Link>
                                </h6>
                            </div>
                            <div className="text-end">
                                <button
                                    type="button"
                                    className="mb-20 h6 text-gray-500 text-lg fw-normal hover-text-main-600"
                                >
                                    Next
                                </button>
                                <h6 className="text-lg mb-0">
                                    <Link to="/blog-details" className="">
                                        Next Blog Title
                                    </Link>
                                </h6>
                            </div>
                        </div>
                        <div className="my-48">
                            <span className="border-bottom border-gray-100 d-block" />
                        </div>
                        <div className="my-48">
                            <form action="#">
                                <h6 className="mb-24">Leave a Comment</h6>
                                <div className="row gy-4">
                                    <div className="col-sm-6 col-xs-6">
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="common-input px-16"
                                            id="name"
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-6">
                                        <label
                                            htmlFor="email"
                                            className="text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="common-input px-16"
                                            id="email"
                                            placeholder="Email address"
                                        />
                                    </div>
                                    <div className="col-sm-12">
                                        <label
                                            htmlFor="message"
                                            className="text-sm font-heading-two text-gray-900 fw-semibold mb-4"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            className="common-input px-16"
                                            id="message"
                                            placeholder="What's your thought about this blog..."
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="col-sm-12 mt-32">
                                        <button
                                            type="submit"
                                            className="btn btn-main py-18 px-32 rounded-8"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="my-48">
                            <form action="#">
                                <h6 className="mb-48">Comments</h6>
                                <div className="d-flex align-items-start gap-16 mb-32 pb-32 border-bottom border-gray-100">
                                    <img
                                        src="/placeholder-image.jpg"
                                        alt="Comment Author"
                                        className="w-40 h-40 rounded-circle object-fit-cover flex-shrink-0"
                                    />
                                    <div className="flex-grow-1">
                                        <div className="flex-align gap-8">
                                            <h6 className="text-md fw-bold mb-0">Comment Author</h6>
                                            <span className="w-6 h-6 bg-gray-500 rounded-circle" />
                                            <span className="text-sm fw-medium text-gray-700">
                                                {new Date().toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <p className="mt-16 text-gray-700">
                                            Sample comment for this blog post.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-48">
                                    <button
                                        type="submit"
                                        className="btn btn-main py-13 flex-align gap-8"
                                    >
                                        Load More <i className="ph ph-spinner-gap text-2xl" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-4 ps-xl-4">
                        <SearchSidebar />
                        <RecentPostsSidebar posts={sortedBlogs} />
                        <TagsSidebar tags={tags} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogDetails;