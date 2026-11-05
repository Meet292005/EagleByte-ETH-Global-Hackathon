import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { LogOut, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';

interface ContactMessage {
    _id: string;
    fullName: string;
    email: string;
    mobile: string;
    projectTitle: string;
    description: string;
    createdAt: string;
}

const Admin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('userEmail');

            if (!token) {
                toast({
                    title: "Access Denied",
                    description: "You do not have permission to view this page.",
                    variant: "destructive"
                });
                navigate('/');
                return;
            }

            // Decode the JWT token to check if it's valid and the user is an admin
            try {
                const decodedToken = jwtDecode<any>(token);
                const currentTime = Date.now() / 1000;

                // Check if token is expired
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userEmail');
                    toast({
                        title: "Session Expired",
                        description: "Your session has expired. Please log in again.",
                        variant: "destructive"
                    });
                    navigate('/');
                    return;
                }

                // Check if user is an admin
                if (!decodedToken.isAdmin) {
                    toast({
                        title: "Access Denied",
                        description: "You do not have admin privileges to access this page.",
                        variant: "destructive"
                    });
                    navigate('/');
                    return;
                }

                // Optionally verify token validity by making a request to a protected endpoint
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Token validation failed:', errorData.message);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userEmail');
                    toast({
                        title: "Session Expired",
                        description: "Please log in again.",
                        variant: "destructive"
                    });
                    navigate('/');
                    return;
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                toast({
                    title: "Invalid Token",
                    description: "Your authentication token is invalid. Please log in again.",
                    variant: "destructive"
                });
                navigate('/');
                return;
            }

            fetchContacts();
        };

        checkAuth();
    }, [navigate, toast]);

    // Socket.io effect for real-time updates
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('newContact', (newContact: ContactMessage) => {
            setContacts((prevContacts) => [newContact, ...prevContacts]);
            toast({
                title: "New Contact Message",
                description: `From ${newContact.fullName}`,
                duration: 5000,
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [toast]);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(data);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch contacts:', errorData.message);
                toast({
                    title: "Error",
                    description: errorData.message || "Failed to fetch contact messages",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Failed to fetch contacts', error);
            toast({
                title: "Network Error",
                description: "Unable to connect to the server. Please check your connection.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setContacts(contacts.filter(contact => contact._id !== id));
                toast({
                    title: "Success",
                    description: "Message deleted successfully.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete message.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive"
            });
        }
    };

    return (
        <Layout>
            <SEOHead title="Admin Dashboard" description="Admin dashboard for managing contact messages and user inquiries" />
            <section className="pt-32 pb-20 min-h-screen">
                <div className="container-custom">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="font-display text-4xl font-bold">
                            Admin <span className="text-gradient">Dashboard</span>
                        </h1>
                        <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-6 overflow-x-auto"
                    >
                        <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>

                        {loading ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : contacts.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">No messages found.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-muted-foreground">
                                        <th className="p-4">Date & Time</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Mobile</th>
                                        <th className="p-4">Project Title</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact) => (
                                        <tr key={contact._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 whitespace-nowrap">
                                                {new Date(contact.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                            <td className="p-4 font-medium whitespace-nowrap">{contact.fullName}</td>
                                            <td className="p-4">{contact.email}</td>
                                            <td className="p-4 whitespace-nowrap">{contact.mobile}</td>
                                            <td className="p-4 font-medium">{contact.projectTitle}</td>
                                            <td className="p-4 text-sm text-muted-foreground max-w-xs break-words">{contact.description}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDelete(contact._id)}
                                                    className="text-destructive hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Admin;
