import React, { useState } from "react";
import BlogCard from "../components/BlogCard";
import PostInput from "../components/PostInput";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Blog } from "../../../shared/types/Blog";
import { User } from "../../../shared/types/User";

// Sample data for demo purposes (following the Blog interface from shared/types)
const SAMPLE_BLOGS: Blog[] = [
  {
    _id: "1",
    blogTitle: "Comfort in a Bowl: Homemade Pho Goodness",
    blogContent: "Nothing beats the rich aroma of slow-simmered broth and tender slices of beef—this bowl of pho is my kind of soul food. Topped with fresh herbs, bean sprouts, and a squeeze of lime, every bite feels like a warm hug. Whether you're a pho-natic or just curious, this is your sign to slurp up some happiness today!",
    photos: [
      "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    ],
    likes: 42,
    comments: 12,
    userId: {
      _id: "user1",
      firstName: "Quy",
      lastName: "Nguyen",
      userName: "quynguyen",
      avatar: "https://scontent.fyyz1-1.fna.fbcdn.net/v/t39.30808-6/440768785_8157320000964800_2263785067755066338_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=BHQKwTjo8rIQ7kNvwGCo66T&_nc_oc=AdnHeh0cJFHUyOEsCCjD7ODX6DOYya6lmjtZus5DDGXopvN3tZbYspTMLDc60Z0y3gHk33sqZR4vyWPENgG8h44g&_nc_zt=23&_nc_ht=scontent.fyyz1-1.fna&_nc_gid=rRB8cfuLj98ESSM-K33JDw&oh=00_AfFNiozJ3dl8SqEmZJzXx0A3cSVMULgesJwNMPaLYnyEQA&oe=680A3C44",
    },
    createdAt: "2 hours ago"
  },
  {
    _id: "2",
    blogTitle: "Comfort in a Bowl: Homemade Pho Goodness",
    blogContent: "Nothing beats the rich aroma of slow-simmered broth and tender slices of beef—this bowl of pho is my kind of soul food. Topped with fresh herbs, bean sprouts, and a squeeze of lime, every bite feels like a warm hug. Whether you're a pho-natic or just curious, this is your sign to slurp up some happiness today!",
    photos: [
      "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      "https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
    ],
    likes: 67,
    comments: 23,
    userId: {
      _id: "user2",
      firstName: "Nhat",
      lastName: "Le",
      userName: "nhatle",
      avatar: "https://scontent.fyyz1-1.fna.fbcdn.net/v/t39.30808-6/274251546_743524096636209_4008839464116302251_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=OPfRYybbodMQ7kNvwHfzrfs&_nc_oc=AdlQI7MqDoNSTHo69e0iCFIPflnC7Ft9W36tgO9TXrIzo0iaG9AJs4Pp1HU6Te0WiasW9j0OMe34gxuHjroQHiby&_nc_zt=23&_nc_ht=scontent.fyyz1-1.fna&_nc_gid=BMVvF49URqnhb6l2hNX6yA&oh=00_AfHJal5qS8Ulqst_xEee7J8ufRHpcoVsGUPFiv2ixrWADQ&oe=680A2C5B",
    },
    createdAt: "1 day ago"
  },
  {
    _id: "3",
    blogTitle: "Comfort in a Bowl: Homemade Pho Goodness",
    blogContent: "Nothing beats the rich aroma of slow-simmered broth and tender slices of beef—this bowl of pho is my kind of soul food. Topped with fresh herbs, bean sprouts, and a squeeze of lime, every bite feels like a warm hug. Whether you're a pho-natic or just curious, this is your sign to slurp up some happiness today!",
    photos: [
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ],
    likes: 129,
    comments: 32,
    userId: {
      _id: "user3",
      firstName: "Dan",
      lastName: "Nguyen",
      userName: "dannguyen",
      avatar: "https://scontent.fyyz1-2.fna.fbcdn.net/v/t39.30808-6/483870469_3563194047316559_7854973392000204926_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=w3dRmpM_ZMsQ7kNvwErVqFU&_nc_oc=AdlbwsDvEy6X7oHrJjVLKVucqSSAOw8M4buT4z1IxHj0LvCvFyQRDARoGHyg2ECrDkGcWSUn9yLKx6BZ9LEAQ40h&_nc_zt=23&_nc_ht=scontent.fyyz1-2.fna&_nc_gid=iopv8Vgy5lyL1s92vqSAZw&oh=00_AfFSKkUuSet8wC3UWYziBHc-1yQmlywfaAPpDphZskPOpA&oe=680A36C4",
    },
    createdAt: "2 days ago"
  }
];

const FeedPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>(SAMPLE_BLOGS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCreatePost = (data: { title: string; content: string; photos: File[] }) => {
    // Create object URLs for the uploaded photos for display
    const photoUrls = data.photos.map(file => URL.createObjectURL(file));

    // In a real app, you would upload photos to a server and get back URLs
    // Create a new blog post using the shared Blog interface
    const newBlog: Blog = {
      _id: (blogs.length + 1).toString(),
      blogTitle: data.title,
      blogContent: data.content,
      photos: photoUrls,
      likes: 0,
      comments: 0,
      userId: {
        _id: "current-user",
        firstName: "Current",
        lastName: "User",
        userName: "currentuser",
        avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
      },
      createdAt: "Just now"
    };

    setBlogs([newBlog, ...blogs]);
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feeds</h1>
        <Button className = "bg-brand-coral-300 rounded-full" onClick={handleOpenDialog}>
          <PlusIcon className="mr-1 h-4 w-4" />
          New Post
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create A New Post</DialogTitle>
          </DialogHeader>
          <PostInput 
            onSubmit={handleCreatePost}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <div>
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;