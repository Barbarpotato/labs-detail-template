import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
    Drawer, Button, Input, Text,
    DrawerBody, DrawerFooter, Box,
    DrawerHeader, DrawerOverlay,
    DrawerContent, DrawerCloseButton,
    Flex, Heading
} from '@chakra-ui/react'

// Fetch conversation data from the API
const fetchData = async (message = "", history = [], content = "") => {
    try {

        const filteredHistory = history.map(item => ({
            ...item,
            message: undefined
        }));

        const response = await fetch("https://darwin-assistant.vercel.app/api/v1/conversation/labs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                history: filteredHistory,
                content,
                message
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return {
            response: "This is a mock response. Please run the app in production mode to get real responses."
        };
    }
}

function Darwin({ btnRef, isOpen, onOpen, onClose, content }) {
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // non active the parent scroll vertical of the page
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    useEffect(() => {
        const initialize = async () => {
            const data = await fetchData("", history, content);
            setHistory([
                {
                    role: "user",
                    parts: [{ text: "" }],
                    message: ""
                },
                {
                    role: "model",
                    parts: [{ text: data.response }],
                    message: data.response
                }
            ]);
        };

        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        setLoading(true);
        const currentMessage = message;
        setMessage("");

        setHistory(prev => [
            ...prev,
            {
                role: "user",
                parts: [{ text: currentMessage }],
                message: currentMessage
            },
            {
                role: "model",
                parts: [{ text: "Thinking..." }],
                message: "Thinking..."
            }
        ]);

        const data = await fetchData(currentMessage, history, content);

        setHistory(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
                role: "model",
                parts: [{ text: data.response }],
                message: data.response
            };
            return updated;
        });

        setLoading(false);
    };

    return (
        <Drawer
            blockScrollOnMount={false}
            size="lg"
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    <Heading color="#ff79c6" size="md">Conversation With Darwin</Heading>
                </DrawerHeader>

                <DrawerBody>
                    {history.map((msg, index) => (
                        msg.message && (
                            <Flex
                                key={index}
                                direction="column"
                                align={msg.role === "model" ? "flex-start" : "flex-end"}
                            >
                                <Box
                                    mb={4}
                                    p={3}
                                    borderRadius="md"
                                    bg={msg.role === "model" ? "#2D3748" : "#4A5568"}
                                    color="white"
                                    width="85%"
                                    transition="all 0.2s ease-in-out"
                                    _hover={{
                                        bg: msg.role === "model" ? "#394150" : "#5A6478",
                                        transform: "scale(1.02)",
                                        boxShadow: "md"
                                    }}
                                >
                                    <Text fontWeight="bold" color="#ff79c6">
                                        {msg.role === "model" ? "Darwin" : "You"}
                                    </Text>
                                    <Box mt={1}>
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={coy}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <Text as="code" bg="gray.800" p={1} borderRadius="sm" {...props}>
                                                            {children}
                                                        </Text>
                                                    );
                                                },
                                                p: ({ children }) => <Text mt={1}>{children}</Text>,
                                                ul: ({ children }) => <Box as="ul" pl={4} mt={1}>{children}</Box>,
                                                ol: ({ children }) => <Box as="ol" pl={4} mt={1}>{children}</Box>,
                                                li: ({ children }) => <Text as="li">{children}</Text>,
                                                strong: ({ children }) => <Text as="strong" fontWeight="bold">{children}</Text>,
                                                em: ({ children }) => <Text as="em" fontStyle="italic">{children}</Text>,
                                            }}
                                        >
                                            {msg.message}
                                        </ReactMarkdown>
                                    </Box>
                                </Box>
                            </Flex>
                        )
                    ))}
                </DrawerBody>

                <DrawerFooter>
                    <Flex w="100%">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                            isDisabled={loading}
                            placeholder="Send a message..."
                            borderLeftRadius="2xl"
                            borderRightRadius={0}
                            borderWidth={3}
                            borderColor="#536189"
                            focusBorderColor="#ff79c6"
                            my={2}
                        />
                        <Button
                            onClick={handleSendMessage}
                            isLoading={loading}
                            loadingText="Sending..."
                            colorScheme="purple"
                            borderLeftRadius={0}
                            my={2}
                        >
                            Send
                        </Button>
                    </Flex>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default Darwin;