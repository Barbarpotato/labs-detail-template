import React from 'react';
import { Box, Flex, Text, Link, SimpleGrid, Icon, Heading } from '@chakra-ui/react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    const primaryFontColor = '#faf9ff';
    const secondaryColor = '#bd93f9';
    const currentYear = new Date().getFullYear();

    const connectLinks = [
        { label: 'GitHub', href: 'https://github.com/Barbarpotato' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/darmawan-jr-b16135220/' },
        { label: 'Instagram', href: 'https://www.instagram.com/darmajr94?igsh=OGgwNTRnaGFxeTY1' },
        { label: 'WhatsApp', href: 'https://api.whatsapp.com/send/?phone=6282148282424&text&type=phone_number&app_absent=0' },
    ];

    const resourcesLinks = [
        { label: 'Home', href: 'https://barbarpotato.github.io/' },
        { label: 'About', href: 'https://barbarpotato.github.io/About/' },
        { label: 'Labs', href: 'https://barbarpotato.github.io/Labs/' },
        { label: 'Projects', href: 'https://barbarpotato.github.io/Projects/' },
        { label: 'Experiences', href: 'https://barbarpotato.github.io/Experiences/' },
        { label: 'Badges', href: 'https://barbarpotato.github.io/Badges/' },
    ];

    return (
        <Box boxShadow={'dark-lg'} as="footer" mt={100} backgroundColor={"#292b37"} color="white" py={10}>
            <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
                <Flex direction={{ base: 'column', md: 'row' }} justify={{ md: 'space-between' }}>
                    <Box mb={{ base: 8, md: 0 }} maxW={{ md: 'md' }}>
                        <Flex align="center">
                            <Heading fontSize="2xl" color={primaryFontColor}>
                                <span style={{ color: secondaryColor, fontWeight: 'bold' }}>🚀D</span>armawan
                            </Heading>
                        </Flex>
                        <Text mt={2} color="gray.400">
                            Crafting cutting-edge web experiences with passion and innovation. Let's collaborate to turn your vision into reality.
                        </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={8} w={{ base: 'full', md: 'auto' }}>
                        {/* Connect Links */}
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" mb={4}>
                                Connect
                            </Text>
                            <Flex direction="column" gap={2}>
                                {connectLinks.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        color="gray.400"
                                        _hover={{ color: 'pink.300' }}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </Flex>
                        </Box>

                        {/* Resources Links */}
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" mb={4}>
                                Resources
                            </Text>
                            <Flex direction="column" gap={2}>
                                {resourcesLinks.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        color="gray.400"
                                        _hover={{ color: 'pink.300' }}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </Flex>
                        </Box>
                    </SimpleGrid>
                </Flex>

                <Box mt={8} pt={8} borderTop="1px" borderColor="gray.800">
                    <Flex direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }} justify={{ md: 'space-between' }}>
                        <Flex order={{ md: 2 }} gap={6} mb={{ base: 8, md: 0 }} justify={{ base: 'center', md: 'flex-start' }}>
                            <Link href="https://github.com/Barbarpotato" target="_blank" color="gray.400" _hover={{ color: 'pink.300' }} aria-label="Visit my GitHub profile">
                                <Icon as={FaGithub} boxSize={6} />
                            </Link>
                            <Link href="https://www.linkedin.com/in/darmawan-jr-b16135220/" target="_blank" color="gray.400" _hover={{ color: 'pink.300' }} aria-label="Visit my LinkedIn profile">
                                <Icon as={FaLinkedin} boxSize={6} />
                            </Link>
                            <Link href="https://www.instagram.com/darmajr94?igsh=OGgwNTRnaGFxeTY1" target="_blank" color="gray.400" _hover={{ color: 'pink.300' }} aria-label="Visit my Instagram profile">
                                <Icon as={FaInstagram} boxSize={6} />
                            </Link>
                        </Flex>

                        <Flex order={{ md: 1 }} direction="row" align="center" color="gray.400" justify={{ base: 'center', md: 'flex-start' }}>
                            <Text fontSize="base">
                                © {currentYear} Barbarpotato. All rights reserved.
                            </Text>
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;