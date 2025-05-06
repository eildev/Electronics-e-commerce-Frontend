import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { SearchSidebar, RecentPostsSidebar, TagsSidebar, BlogItem } from './SidebarComponents';
import { useGetBlogQuery } from '../../redux/features/api/blogApi';
import { useGetBlogCategoryQuery } from '../../redux/features/api/blogCategoryApi';

const Blog = () => {
    const { data, isLoading, isError } = useGetBlogQuery();
    const { data: categoryData, isLoading: isLoadingCategory, isError: isErrorCategory } = useGetBlogCategoryQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const articlesPerPage = 2;

    if (isLoading || isLoadingCategory) {
        return <div className="text-center mt-10">Loading blogs...</div>;
    }

    if (isError || isErrorCategory) {
        return <div className="text-center mt-10 text-red-500">Failed to load blogs or categories. Please try again later.</div>;
    }

    const sortedBlogs = data?.blogPost
        ?.slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const filteredBlogs = sortedBlogs?.filter((blog) => {
        const query = searchQuery.toLowerCase();
        const title = blog.title?.toLowerCase() || '';
        const tags = blog.tags?.toLowerCase() || '';
        const categoryName = categoryData?.blogCat?.find(cat => cat.id === blog.cat_id)?.cat_name?.toLowerCase() || '';
        const matchesSearch = (
            title.includes(query) ||
            tags.includes(query) ||
            categoryName.includes(query)
        );
        const matchesCategory = selectedCategory ? blog.cat_id === selectedCategory : true;
        return matchesSearch && matchesCategory;
    }) || [];

    const totalArticles = filteredBlogs.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = filteredBlogs.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button
                        className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                        onClick={() => handlePageChange(i)}
                    >
                        {i < 10 ? `0${i}` : i}
                    </button>
                </li>
            );
        }

        return (
            <ul className="pagination flex-align flex-wrap gap-16">
                <li className="page-item">
                    <button
                        className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <i className="ph-bold ph-arrow-left" />
                    </button>
                </li>
                {pages}
                <li className="page-item">
                    <button
                        className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <i className="ph-bold ph-arrow-right" />
                    </button>
                </li>
            </ul>
        );
    };

    const tags = data?.blogPost
        ?.flatMap((post) => post.tags?.split(',') || [])
        .filter((tag, index, self) => self.indexOf(tag) === index);

    return (
        <section className="blog py-80">
            <div className="container container-lg">
                <div className="row gy-5">
                    <div className="col-lg-8 pe-xl-4">
                        <div className="blog-item-wrapper">
                            {currentArticles?.length > 0 ? (
                                currentArticles.map((article) => (
                                    <BlogItem key={article.id} article={article} />
                                ))
                            ) : (
                                <div className="text-center py-32 text-gray-600 text-md">
                                    No blogs found matching your search or category.
                                </div>
                            )}
                        </div>
                        {totalArticles > 0 && renderPagination()}
                    </div>
                    <div className="col-lg-4 ps-xl-4">
                        <SearchSidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} setCurrentPage={setCurrentPage} />
                        <RecentPostsSidebar posts={sortedBlogs} />
                        <TagsSidebar tags={tags} setSelectedCategory={setSelectedCategory} categoryData={categoryData} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;