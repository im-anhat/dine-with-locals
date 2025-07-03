import Chat from '../models/Chat.js';
import asyncHandler from 'express-async-handler';
import Match from '../models/Match.js';
import Listing from '../models/Listing.js';
export const accessChat = asyncHandler(async (req, res) => {
    const { userId, listingId } = req.body; // id of the user to chat with
    console.log('accessChat called with userId:', userId, 'listingId:', listingId);
    const currentUser = req.user; // currently logged in user
    if (!userId) {
        console.log('userId not sent with request');
        res.sendStatus(400);
        return;
    }
    if (userId === currentUser._id) {
        console.log('Cannot chat with yourself');
        res.status(400).json({ message: 'Cannot chat with yourself' });
        return;
    }
    // check if chat already exists between the two users
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: currentUser._id } } },
            { users: { $elemMatch: { $eq: userId } } },
            { listing: { $eq: listingId } },
        ],
    }).populate([
        {
            path: 'users',
            select: '_id userName firstName lastName phone avatar role',
        },
        {
            path: 'latestMessage',
            populate: {
                path: 'senderId',
                model: 'User',
                select: '_id firstName',
            },
        },
        // field added to view associated listing details in the chat
        {
            path: 'listing',
            populate: {
                path: 'locationId',
                model: 'Location',
            },
        },
    ]);
    console.log('isChat listing:', isChat);
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        // if chat does not exist, create a new chat
        const chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [currentUser._id, userId],
            listing: listingId,
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate([
                {
                    path: 'users',
                    select: '_id userName firstName lastName phone avatar role',
                },
                {
                    path: 'listing',
                    select: '_id title images time',
                    populate: {
                        path: 'locationId',
                        model: 'Location',
                        select: 'city state country',
                    },
                },
            ]);
            res.status(200).json(FullChat);
            console.log('Chat created successfully:', FullChat);
        }
        catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
});
export const createOrUpdateGroupChat = asyncHandler(async (req, res) => {
    const { listingId, hostId } = req.body;
    if (!listingId) {
        res.status(400).json({ message: 'listingId not provided' });
        return;
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
        res.status(404).json({ message: 'Listing not found' });
        return;
    }
    if (listing.userId.toString() !== hostId.toString()) {
        res.status(403).json({
            message: 'Only the host can create a group chat for this listing.',
        });
        return;
    }
    const matches = await Match.find({
        listingId: listingId,
        status: 'approved',
    });
    const guestIds = matches.map((match) => match.guestId);
    const allUserIds = [hostId, ...guestIds];
    let groupChat = await Chat.findOne({
        listing: listingId,
        isGroupChat: true,
    });
    if (groupChat) {
        groupChat.users = allUserIds;
        await groupChat.save();
        const fullChat = await Chat.findById(groupChat._id).populate([
            {
                path: 'users',
                select: '_id userName firstName lastName phone avatar role',
            },
            {
                path: 'listing',
                select: '_id title images time',
                populate: {
                    path: 'locationId',
                    model: 'Location',
                    select: 'city state country',
                },
            },
        ]);
        res.status(200).json(fullChat);
    }
    else {
        const chatData = {
            chatName: listing.title,
            isGroupChat: true,
            users: allUserIds,
            listing: listingId,
            groupAdmin: hostId,
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate([
                {
                    path: 'users',
                    select: '_id userName firstName lastName phone avatar role',
                },
                {
                    path: 'listing',
                    select: '_id title images time',
                    populate: {
                        path: 'locationId',
                        model: 'Location',
                        select: 'city state country',
                    },
                },
            ]);
            res.status(200).json(FullChat);
        }
        catch (error) {
            console.error('Error creating group chat:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
export const fetchChats = asyncHandler(async (req, res) => {
    const currentUser = req.user; // currently logged in user
    try {
        let chats = await Chat.find({
            users: { $elemMatch: { $eq: currentUser._id } },
        })
            .populate([
            {
                path: 'users',
                select: '_id userName firstName lastName phone avatar role',
            },
            {
                path: 'latestMessage',
                populate: {
                    path: 'senderId',
                    model: 'User',
                    select: '_id firstName',
                },
            },
            {
                path: 'listing',
                select: '_id title images time',
                populate: {
                    path: 'locationId',
                    model: 'Location',
                    select: 'city state country',
                },
            },
        ])
            .sort({ updatedAt: -1 });
        // console.log('Fetched chats:', chats);
        res.status(200).json(chats);
    }
    catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
export const getChatInfo = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    try {
        const chat = await Chat.findById(chatId).populate([
            {
                path: 'users',
                select: '_id userName firstName lastName phone avatar role',
            },
            {
                path: 'listing',
                populate: {
                    path: 'locationId',
                    model: 'Location',
                },
            },
        ]);
        res.status(200).json(chat);
    }
    catch (error) {
        console.error('Error fetching chat info:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
});
