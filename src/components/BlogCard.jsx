import { Badge, Text, Card, CardBody, CardFooter, CardHeader, Heading, Flex, Spacer } from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa'; // Importing calendar icon from react-icons

// Define your custom colors based on your theme
const themeColors = {
    background: '#292b37',
    text: '#faf9ff',
    accent: '#866bab',
    hover: '#cc7bc9',
    mutedText: '#b0b0b0',
};

// Format the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// BlogCard component
const BlogCard = ({ article }) => {
    return (
        <Card
            width={'100%'}
            variant="outline"
            borderRadius="lg"
            boxShadow="md"
            _hover={{ boxShadow: 'lg', borderColor: themeColors.hover }}
            transition="all 0.2s"
            bg={themeColors.background}
            color={themeColors.text}
        >
            <CardHeader>
                <Flex wrap="wrap" gap={2} mb={2}>
                    {article.categories.map((category) => (
                        <Badge
                            key={category}
                            variant="subtle"
                            colorScheme="purple"
                            _hover={{ bg: themeColors.accent, color: themeColors.text }}
                        >
                            {category}
                        </Badge>
                    ))}
                </Flex>
                <Heading as="h3" size="md" isTruncated>
                    <a
                        href={`/blog/${article.slug}`}
                        style={{ textDecoration: 'none', color: themeColors.text, fontWeight: 'bold' }}
                        _hover={{ color: themeColors.hover }}
                    >
                        {article.title}
                    </a>
                </Heading>
                <Flex align="center" fontSize="sm" color={themeColors.mutedText} mt={2}>
                    <FaCalendarAlt size={16} style={{ marginRight: '4px' }} />
                    <Text as="time" dateTime={article.date}>{formatDate(article.date)}</Text>
                    <Spacer />
                </Flex>
            </CardHeader>
            <CardBody flex="1">
                <Text color={themeColors.mutedText} noOfLines={3}>{article.excerpt}</Text>
            </CardBody>
            <CardFooter>
                <a
                    href={`https://barbarpotato.github.io/Labs-${article.index}/${article.slug}`}
                    style={{ textDecoration: 'none', color: themeColors.accent }}
                >
                    <Text
                        _hover={{ textDecoration: 'underline', color: themeColors.hover }}
                        fontWeight="medium"
                    >
                        Read more
                    </Text>
                </a>
            </CardFooter>
        </Card>
    );
};

export default BlogCard;
