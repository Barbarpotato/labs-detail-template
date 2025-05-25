import Head from 'next/head';
import { FaArrowLeft } from 'react-icons/fa';
import { AiOutlineCalendar } from "react-icons/ai";
import { MdSupportAgent } from "react-icons/md";
import {
    Box, Button, Heading, HStack,
    useDisclosure, VStack, Divider,
    Flex, Text, TagLabel, Tag, WrapItem, Wrap
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from 'react';

import Darwin from '../components/Darwin';
import BlogCard from '@/components/BlogCard';

import 'prismjs/themes/prism-tomorrow.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml.min.js';


export async function getStaticPaths() {
    const res = await fetch('https://api-barbarpotato.vercel.app/labs?index=6b86b273ff34f');
    if (!res.ok) return { paths: [], fallback: false };

    const { data } = await res.json();
    return {
        paths: data.map(article => ({ params: { slug: article.slug } })),
        fallback: false
    };
}


export async function getStaticProps({ params }) {

    const res = await fetch(`https://api-barbarpotato.vercel.app/labs?slug=${params.slug}`);
    if (!res.ok) return { notFound: true };

    let article = await res.json();
    if (article.data) article = article.data[0];

    // find the tags from search
    const res2 = await fetch(`https://api-barbarpotato.vercel.app/labs/search?blog_id=${article.blog_id}`);
    const data = await res2.json();
    const tagArticles = data.data[0];

    // Fetch recommended blogs based on tags
    const tags = tagArticles.tags.join(',');
    const recommendedRes = await fetch(`https://api-barbarpotato.vercel.app/labs/search?tag=${tags}`);
    const recommendedData = await recommendedRes.json();

    // Ensure recommendedPosts is an array, and filter out the current article
    const recommendedPosts = (recommendedData.data || [])
        .filter((recommendedPost) => recommendedPost.blog_id !== article.blog_id) // Exclude current article
        .slice(0, 3); // Return only top 3 posts

    return {
        props: {
            article,
            recommendedPosts
        }
    };
}


export default function ArticlePage({ article, recommendedPosts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef();
    const [isMobile, setIsMobile] = useState(false);
    const [tocVisible, setTocVisible] = useState(false);
    const [toc, setToc] = useState([]);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    // Generate TOC
    useEffect(() => {
        const generateTOC = () => {
            const div = document.createElement('div');
            div.innerHTML = article?.description || '';
            const headers = div.querySelectorAll('h1, h2, h3');
            return Array.from(headers).map((header, index) => ({
                id: `toc-header-${index}`,
                text: header.innerText,
                level: parseInt(header.tagName.substring(1)),
            }));
        };

        setToc(generateTOC());
    }, [article]);

    // Assign IDs to headers
    useEffect(() => {
        const contentDiv = document.querySelector('.content');
        const headers = contentDiv?.querySelectorAll('h1, h2, h3') || [];
        headers.forEach((header, index) => {
            header.setAttribute('id', `toc-header-${index}`);
        });
    }, [article]);

    // Style pre and code tags
    useEffect(() => {
        const contentDiv = document.querySelector('.content');
        const preTags = contentDiv?.querySelectorAll('pre') || [];
        const codeTags = contentDiv?.querySelectorAll('code') || [];

        preTags.forEach(tag => {
            tag.style.width = "1024px";
            tag.parentNode.style.overflowX = 'scroll';
        });

        codeTags.forEach(tag => {
            tag.classList.add('language-js'); // You can specify the language here
        });

        // Initialize Prism for syntax highlighting
        Prism.highlightAll();

        // Observer for dynamic content updates
        const observer = new MutationObserver(() => {
            Prism.highlightAll(); // Re-apply syntax highlighting on new content
        });

        if (contentDiv) observer.observe(contentDiv, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [article]);

    return (
        <>
            <Head>
                <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/personal-blog-darmajr.appspot.com/o/portofolio%2Fadmin%2FAvatar.svg?alt=media&token=622405c3-9dff-4483-af0c-ddc95fbe6445" />
                <title>{article.title}</title>
                <meta name="description" content={article.short_description} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.short_description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://barbarpotato.github.io/labs/${article.slug}`} />
            </Head>

            {/* TOC Container */}
            <div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '6px',
                }}
            >

                {!isMobile && (
                    <div
                        onMouseEnter={() => setTocVisible(true)}
                        onMouseLeave={() => setTocVisible(false)}
                        style={{
                            backgroundColor: '#1E1E1E',
                            padding: tocVisible ? '12px' : 0,
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                            overflowX: 'hidden',
                            color: 'white',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                            transition: 'width 0.3s ease, padding 0.3s ease',
                            width: tocVisible ? '240px' : '20px',
                            fontFamily: 'sans-serif',
                            fontSize: '0.9em',
                        }}
                    >
                        {!tocVisible ? (
                            <div
                                style={{
                                    writingMode: 'vertical-rl',
                                    transform: 'rotate(180deg)',
                                    cursor: 'pointer',
                                    color: '#aaa',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '12px 0px 12px 12px',
                                }}
                            >
                                Table Of Contents
                            </div>
                        ) : (
                            toc.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        marginLeft: (item.level - 1) * 12,
                                        backgroundColor: '#1E1E1E',
                                        padding: tocVisible ? '12px' : '4px',
                                        borderTopRightRadius: 12,
                                        borderBottomRightRadius: 12,
                                        overflowX: 'hidden',
                                        color: 'white',
                                        maxHeight: '80vh',
                                        overflowY: 'auto',
                                        boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                                        transition: 'width 0.3s ease, padding 0.1s ease, opacity 0.1s ease',
                                        width: tocVisible ? '240px' : '20px',
                                        fontFamily: 'sans-serif',
                                        fontSize: '0.9em',
                                        opacity: tocVisible ? 1 : 0.4 // ← transition target
                                    }}
                                >
                                    <a
                                        href={`#${item.id}`}
                                        style={{
                                            color: '#f0f0f0',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseOver={e => (e.target.style.color = '#8AB4F8')}
                                        onMouseOut={e => (e.target.style.color = '#f0f0f0')}
                                    >
                                        {item.text}
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {isMobile && (
                    <>
                        <button
                            onClick={() => setTocVisible(prev => !prev)}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: 8,
                                transform: 'translateY(-50%)',
                                zIndex: 1100,
                                backgroundColor: '#3F3F3F',
                                color: 'white',
                                border: 'none',
                                borderTopRightRadius: 12,
                                borderBottomRightRadius: 12,
                                padding: 8,
                                cursor: 'pointer',
                                writingMode: 'vertical-rl',
                                transformOrigin: 'center',
                                fontSize: '0.7em',
                                height: 60,
                                width: 28,
                                boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                            }}
                        >
                            TOC
                        </button>

                        {tocVisible && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: 42,
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#1E1E1E',
                                    padding: '12px 25px',
                                    borderRadius: 8,
                                    color: 'white',
                                    maxHeight: '70vh',
                                    width: '220px', // ← wider
                                    overflowY: 'auto',
                                    boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                                    zIndex: 1099,
                                }}
                            >
                                {toc.map(item => (
                                    <div
                                        key={item.id}
                                        style={{
                                            marginLeft: (item.level - 1) * 12,
                                            padding: '6px 0',
                                            borderBottom: '1px solid #333',
                                        }}
                                    >
                                        <a
                                            href={`#${item.id}`}
                                            style={{
                                                color: '#f0f0f0',
                                                textDecoration: 'none',
                                                display: 'block',
                                                fontSize: '0.9em',
                                            }}
                                        >
                                            {item.text}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div >

            {/* Article Content */}
            <article style={{ marginTop: '50px' }}>


                <Box mx="auto" w={{ base: '70%', md: '35%' }}>

                    <Flex opacity={0.7} __hover={{ opacity: 1 }} alignItems="center" my={6} cursor="pointer" onClick={() => window.location.href = '/Labs/'}>
                        <FaArrowLeft />
                        <Text ml={2}>Back to Labs Content</Text>
                    </Flex>

                    <Wrap spacing={3} my={6}>
                        {article.tags.map((tag, index) => (
                            <WrapItem key={index}>
                                <Tag
                                    size="md"
                                    borderRadius="full"
                                    variant="solid"
                                    colorScheme="gray"
                                >
                                    <TagLabel>{tag}</TagLabel>
                                </Tag>
                            </WrapItem>
                        ))}
                    </Wrap>

                    <Heading my={6} color="whitesmoke">{article.title}</Heading>

                    <HStack
                        my={6}
                        spacing={2}
                        align="center"
                        flexWrap="wrap"   // allows wrapping on small screens
                    >
                        <AiOutlineCalendar size={20} style={{ opacity: 0.7 }} />
                        <Text
                            fontSize={{ base: "xs", md: "sm" }}
                            color="gray.500"
                            whiteSpace={{ base: "normal", md: "nowrap" }}  // wrap on mobile, no wrap on desktop
                        >
                            {article.timestamp}
                        </Text>
                    </HStack>

                </Box>

                <Divider mx="auto" w={{ base: '70%', md: '35%' }} my={6} />

                <Box mx="auto" w={{ base: '70%', md: '35%' }} display="flex" justifyContent="center">
                    <div
                        className="content"
                        style={{ overflowX: 'auto', fontSize: '1.3em' }}
                        dangerouslySetInnerHTML={{ __html: article.description }}
                    />
                </Box>


                {recommendedPosts.length > 0 && (
                    <Fragment>
                        <Divider mx="auto" w={{ base: '70%', md: '35%' }} my={10} />
                        <Box mx="auto" w={{ base: '70%', md: '35%' }} borderColor="gray.200">
                            <Heading fontWeight="bold" mb={6}>
                                Another Recommended Labs Content
                            </Heading>
                            <VStack spacing={6}>
                                {recommendedPosts.map((recommendedPost) => (
                                    <BlogCard
                                        key={recommendedPost.blog_id}
                                        article={{
                                            id: recommendedPost.blog_id,
                                            title: recommendedPost.title,
                                            slug: recommendedPost.slug,
                                            excerpt: recommendedPost.short_description,
                                            date: recommendedPost.timestamp,
                                            index: recommendedPost.index,
                                            categories: recommendedPost.tags,
                                            image: recommendedPost.image
                                        }}
                                    />
                                ))}
                            </VStack>
                        </Box>
                    </Fragment>
                )}


                {/* Floating Button */}
                {isMobile ? (
                    <button
                        ref={btnRef}
                        onClick={onOpen}
                        style={{
                            opacity: "70%",
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 1000,
                            backgroundColor: '#ff79c6',
                            borderRadius: '50%',
                            padding: '12px',
                            border: 'none'
                        }}
                    >
                        <MdSupportAgent size={30} color="white" />
                    </button>
                ) : (
                    <Button
                        ref={btnRef}
                        position="fixed"
                        right="20px"
                        bottom="20px"
                        zIndex={1000}
                        colorScheme="purple"
                        onClick={onOpen}
                    >
                        Ask Darwin AI
                    </Button>
                )}
                <Darwin btnRef={btnRef} isOpen={isOpen} onOpen={onOpen} onClose={onClose} content={article.description} />
            </article >

        </>
    );
}