'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { AppBar, Toolbar, Box, Modal, Typography, Stack, TextField, Button, Container, Card, CardContent, CardActions, IconButton, Grid } from '@mui/material'
import { Search as SearchIcon, Add as AddIcon, Remove as RemoveIcon, LibraryBooks as LibraryBooksIcon, CameraAlt as CameraAltIcon, RestaurantMenu as RestaurantMenuIcon } from '@mui/icons-material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore'

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const maxItemsPerShelf = 4; // Define how many items each shelf can hold

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            })
        })
        setInventory(inventoryList)
    }

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + 1 })
        } else {
            await setDoc(docRef, { quantity: 1 })
        }

        await updateInventory()
    }

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - 1 })
            }
        }

        await updateInventory()
    }

    useEffect(() => {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const numberOfShelves = Math.ceil(filteredInventory.length / maxItemsPerShelf);

    return (
        <Box sx={{ bgcolor: '#f4f4f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" sx={{ bgcolor: '#2c3e50' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Inventory Management
                    </Typography>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon position="start" />
                            ),
                            sx: { bgcolor: 'white', borderRadius: 1 }
                        }}
                        sx={{ bgcolor: 'white', borderRadius: 1, mr: 2 }}
                    />
                    <Button
                        color="inherit"
                        onClick={handleOpen}
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: '#1abc9c',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#16a085'
                            },
                            borderRadius: 2,
                            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
                        }}
                    >
                        Add New Item
                    </Button>
                </Toolbar>
            </AppBar>

            <Modal open={open} onClose={handleClose}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    width={400}
                    bgcolor="background.paper"
                    boxShadow={24}
                    p={4}
                    sx={{ transform: 'translate(-50%, -50%)', bgcolor: 'white', borderRadius: 2 }}
                >
                    <Typography variant="h6">Add Item</Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        sx={{ my: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            addItem(itemName)
                            handleClose()
                        }}
                        fullWidth
                        sx={{ bgcolor: '#1abc9c', '&:hover': { bgcolor: '#16a085' } }}
                    >
                        Add
                    </Button>
                </Box>
            </Modal>

            <Container maxWidth="md" sx={{ mt: 4, flex: 1 }}>
                <Box mt={4} sx={{ position: 'relative' }}>
                    <Typography variant="h4" gutterBottom>
                        Inventory Items
                    </Typography>
                    {filteredInventory.length === 0 && (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <LibraryBooksIcon sx={{ fontSize: 60, opacity: 0.5 }} />
                            <Typography variant="subtitle1" color="text.secondary">
                                Your shelf is empty. Add items to fill it.
                            </Typography>
                        </Box>
                    )}
                    {Array.from({ length: numberOfShelves }).map((_, shelfIndex) => (
                        <Grid container spacing={3} key={shelfIndex} sx={{ marginBottom: 3 }}>
                            {filteredInventory.slice(shelfIndex * maxItemsPerShelf, (shelfIndex + 1) * maxItemsPerShelf).map(item => (
                                <Grid item xs={3} key={item.name}>
                                    <Card sx={{ bgcolor: '#ecf0f1', boxShadow: 2 }}>
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Quantity: {item.quantity}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <IconButton onClick={() => addItem(item.name)} sx={{ color: '#1abc9c' }}>
                                                <AddIcon />
                                            </IconButton>
                                            <IconButton onClick={() => removeItem(item.name)} sx={{ color: '#e74c3c' }}>
                                                <RemoveIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Box>

                <Box mt={6}>
                    <Typography variant="h4" gutterBottom>
                        Future Features
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: '#ecf0f1', boxShadow: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        <CameraAltIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                                        Upload Pictures
                                    </Typography>
                                    <Typography sx={{ mt: 2 }} color="text.secondary">
                                        Upload pictures of your pantry items, and use GPT vision to automatically recognize and add items to your inventory.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: '#ecf0f1', boxShadow: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        <RestaurantMenuIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                                        Suggest Recipes
                                    </Typography>
                                    <Typography sx={{ mt: 2 }} color="text.secondary">
                                        Based on the items in your inventory, get recipe suggestions to make the most out of your pantry.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Box component="footer" sx={{ bgcolor: '#2c3e50', color: 'white', py: 2, mt: 'auto' }}>
                <Container maxWidth="md">
                    <Typography variant="body1" align="center">
                        &copy; 2024 Pantry Manager Abdishakur Abdullahi.
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}
