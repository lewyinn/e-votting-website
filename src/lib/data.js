const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.json');

// console.log('Data file path:', dataFilePath);

let data = {
    events: [],
    users: [
        {
            id: 1,
            name: "Admin",
            email: "admin@example.com",
            password: bcrypt.hashSync("admin123", 10),
            role: "admin",
        },
    ],
    candidates: [],
    votes: [],
};

try {
    if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        data = JSON.parse(fileContent);
        console.log('Loading data dari data.json');

        const adminUser = data.users.find(u => u.email === 'admin@example.com');
        if (adminUser) {
            const isValidPassword = bcrypt.compareSync('admin123', adminUser.password);
            if (!isValidPassword) {
                console.log('Password admin salah atau tidak sesuai, reset password');
                adminUser.password = bcrypt.hashSync('admin123', 10);
                fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                console.log('Password admin telah direset');
            } else {
                console.log('Password admin valid, tidak perlu reset');
            }
        } else {
            console.log('Tidak ditemukan user admin, menambahkan user admin baru');
            data.users.push({
                id: data.users.length + 1,
                name: "Admin",
                email: "admin@example.com",
                password: bcrypt.hashSync("admin123", 10),
                role: "admin",
            });
            fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
            console.log('Admin user telah ditambahkan');
        }
    } else {
        console.log('data.json tidak ditemukan, membuat file baru dengan data awal');
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    }
} catch (error) {
    console.error('Gagal loading atau menambahkan data.json:', error.message);
}

const saveData = () => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        console.log('Data disimpan ke data.json');
    } catch (error) {
        console.error('Gagal Menyimpan data ke data.json:', error.message);
    }
};

// Event CRUD
const addEvent = (event) => {
    try {
        const newEvent = { id: data.events.length + 1, ...event, status: 'active' };
        data.events.push(newEvent);
        saveData();
        console.log(`Event Ditambahkan: ${newEvent.name}`);
        return newEvent;
    } catch (error) {
        console.error('Gagal Menambahkan event:', error.message);
    }
};

const updateEvent = (id, updatedEvent) => {
    try {
        const index = data.events.findIndex(e => e.id === id);
        if (index !== -1) {
            data.events[index] = { ...data.events[index], ...updatedEvent };
            saveData();
            console.log(`Event diupdated: ${id}`);
        }
    } catch (error) {
        console.error('Gagal Updated event:', error.message);
    }
};

const deleteEvent = (id) => {
    try {
        data.events = data.events.filter(e => e.id !== id);
        data.candidates = data.candidates.filter(c => c.eventId !== id);
        data.votes = data.votes.filter(v => v.eventId !== id);
        saveData();
        console.log(`Event dihapus: ${id}`);
    } catch (error) {
        console.error('Gagal Menghapus event:', error.message);
    }
};

const getEvents = () => data.events;

// User CRUD
const addUser = async (user) => {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = { id: data.users.length + 1, ...user, password: hashedPassword };
        data.users.push(newUser);
        saveData();
        console.log(`User ditambahkan: ${newUser.email}`);
        return newUser;
    } catch (error) {
        console.error('Gagal Menambahkan user:', error.message);
    }
};

const updateUser = async (id, updatedUser) => {
    try {
        const index = data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            if (updatedUser.password) {
                updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
            }
            data.users[index] = { ...data.users[index], ...updatedUser };
            saveData();
            console.log(`User diupdated: ${id}`);
        }
    } catch (error) {
        console.error('Gagal updated user:', error.message);
    }
};

const deleteUser = (id) => {
    try {
        data.users = data.users.filter(u => u.id !== id);
        saveData();
        console.log(`User dihapus: ${id}`);
    } catch (error) {
        console.error('Gagal Hapus user:', error.message);
    }
};

const getUsers = () => data.users;

const findUserByEmail = (email) => data.users.find(u => u.email === email);

// Candidate CRUD
const addCandidate = (candidate) => {
    try {
        const event = data.events.find(e => e.id === candidate.eventId && e.status === 'active');
        if (!event) throw new Error('Aktif Event tidak ditemukan');
        const newCandidate = { id: data.candidates.length + 1, ...candidate };
        data.candidates.push(newCandidate);
        saveData();
        console.log(`Candidate ditambahkan: ${newCandidate.name}`);
        return newCandidate;
    } catch (error) {
        console.error('Gagal Menambahkan candidate:', error.message);
        throw error;
    }
};

const updateCandidate = (id, updatedCandidate) => {
    try {
        const index = data.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
            data.candidates[index] = { ...data.candidates[index], ...updatedCandidate };
            saveData();
            console.log(`Candidate diupdated: ${id}`);
        }
    } catch (error) {
        console.error('Gagal Updated candidate:', error.message);
    }
};

const deleteCandidate = (id) => {
    try {
        data.candidates = data.candidates.filter(c => c.id !== id);
        saveData();
        console.log(`Candidate dihapus: ${id}`);
    } catch (error) {
        console.error('Gagal Hapus candidate:', error.message);
    }
};

const getCandidates = () => data.candidates;

// Vote CRUD
const addVote = (vote) => {
    try {
        const event = data.events.find(e => e.id === vote.eventId && e.status === 'active');
        if (!event) throw new Error('Active event not found');
        if (new Date(event.endDate) < new Date()) throw new Error('Event has ended');
        if (data.votes.some(v => v.userId === vote.userId && v.eventId === vote.eventId)) {
            throw new Error('User has already voted for this event');
        }
        const newVote = { id: data.votes.length + 1, ...vote };
        data.votes.push(newVote);
        saveData();
        console.log(`Vote ditambahkan untuk candidate: ${newVote.candidateId}`);
        return newVote;
    } catch (error) {
        console.error('Gagal Menambahkan vote:', error.message);
        throw error;
    }
};

const getVotes = () => data.votes;

const getVotesByEvent = (eventId) => data.votes.filter(v => v.eventId === eventId);

module.exports = {
    addEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    addUser,
    updateUser,
    deleteUser,
    getUsers,
    findUserByEmail,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    getCandidates,
    addVote,
    getVotes,
    getVotesByEvent,
};