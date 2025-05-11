import {
    Flex,
    Heading,
    IconButton,
    useDisclosure,
    VStack,
    HStack,
    Button,
    Box,
    Collapse,
} from '@chakra-ui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';

function Navigation() {
    const { isOpen, onToggle } = useDisclosure();
    const [activePath, setActivePath] = useState('/');

    const primaryFontColor = '#faf9ff';
    const secondaryColor = '#bd93f9';

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/About/' },
        { label: 'Labs', path: '/Labs/' },
        { label: 'Projects', path: '/Projects/' },
        { label: 'Experiences', path: '/Experiences/' },
        { label: 'Badges', path: '/Badges/' },
    ];

    useEffect(() => {
        const normalized = normalizePath(window.location.pathname);
        setActivePath(normalized);
    }, []);

    const normalizePath = (path) => path.replace(/\/+$/, '') || '/';

    const handleNav = (path) => {
        const normalized = normalizePath(path);
        if (normalized !== activePath) {
            window.location.href = path;
        }
    };

    const isActive = (path) => normalizePath(path) === activePath;

    return (
        <Fragment>
            <Flex
                backgroundColor="#292b37"
                id="navigation"
                p={5}
                alignItems="center"
                justifyContent="space-between"
                zIndex={30} // higher than Hero and Collapse content
            >
                <Flex p={2}>
                    <Heading fontSize="2xl" color={primaryFontColor}>
                        <span style={{ color: secondaryColor, fontWeight: 'bold' }}>🚀D</span>
                        armawan
                    </Heading>
                </Flex>

                <HStack spacing={4} display={{ base: 'none', lg: 'flex' }}>
                    {navItems.map(({ label, path }) => (
                        <Button
                            key={path}
                            onClick={() => handleNav(path)}
                            variant={isActive(path) ? 'solid' : 'ghost'}
                            colorScheme="purple"
                            color={primaryFontColor}
                            borderRadius="md"
                            _hover={{
                                bg: isActive(path) ? secondaryColor : '#6b46c1',
                                transform: 'scale(1.1)',
                                transition: 'transform 0.2s ease-in-out',
                            }}
                            _active={{
                                bg: isActive(path) ? secondaryColor : '#6b46c1',
                                transform: 'scale(0.95)',
                            }}
                            fontWeight={isActive(path) ? 'bold' : 'normal'}
                            p={4}
                        >
                            {label}
                        </Button>
                    ))}
                </HStack>

                <IconButton
                    display={{ base: 'inline-flex', lg: 'none' }}
                    icon={isOpen ? <IoMdClose size={24} /> : <GiHamburgerMenu size={24} />}
                    variant="ghost"
                    color={primaryFontColor}
                    onClick={onToggle}
                    aria-label="Toggle menu"
                />
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <Box
                    position="absolute" // or "fixed" for full-page overlay
                    top="72px" // adjust based on your navbar height
                    width={"100%"}
                    zIndex={20}
                    bg="#292b37"
                    color={primaryFontColor}
                    display={{ lg: 'none' }}
                    px={4}
                    pb={4}
                >
                    <VStack align="stretch" spacing={1} >
                        {navItems.map(({ label, path }) => (
                            <Fragment key={path}>
                                <Button
                                    colorScheme='purple'
                                    onClick={() => {
                                        handleNav(path);
                                        onToggle();
                                    }}
                                    variant={isActive(path) ? 'solid' : 'ghost'}
                                    justifyContent="flex-start"
                                    color={"white"}
                                    borderRadius="md"
                                    fontWeight={isActive(path) ? 'bold' : 'normal'}
                                    w="full"
                                >
                                    {label}
                                </Button>
                            </Fragment>
                        ))}
                    </VStack>
                </Box>
            </Collapse>
        </Fragment>
    );
}

export default Navigation;