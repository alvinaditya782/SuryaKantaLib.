import React, { useState, useEffect, useMemo } from 'react';
const ADMIN_SECRET_CODE = "SURYAKANTA0326";
import { 
  LayoutGrid, BookOpen, Lightbulb, Users, User, 
  Info, LogOut, Search, Plus, Edit, Trash2, Clock, X, Save, Camera, Upload, Book as BookIcon,
  ShieldCheck, UserCheck, ArrowRight, Star
} from 'lucide-react';

// --- DATA AWAL ---
const INITIAL_BOOKS = [
  { 
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publisher: "Scribner",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
    year: "1925",
    isbn: "978-0743273565",
    pages: "180",
    desc: "Classic novel set in the Jazz Age on Long Island.",
    price: 150000,
    status: "Dipinjam",
    borrowerId: 101,
    returnDate: "2026-03-20",
    recommended: false
  },
  { 
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    publisher: "Penguin",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400",
    year: "2018",
    isbn: "978-0735211292",
    pages: "320",
    desc: "An easy & proven way to build good habits & break bad ones.",
    price: 185000,
    status: "Tersedia",
    borrowerId: null,
    returnDate: "",
    recommended: false
  },
];

const INITIAL_MEMBERS = [
  { id: 101, name: "Andi Saputra", email: "andi@mail.com", whatsapp: "08123456789", borrowing: "The Great Gatsby" },
  { id: 102, name: "Siti Aminah", email: "siti@mail.com", whatsapp: "08567891234", borrowing: "-" },
];

// --- UI COMPONENTS ---
const NavItem = ({ icon, label, id, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
      activeTab === id ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-500 hover:bg-gray-50'
    }`}
  >
    {icon} <span className="text-sm">{label}</span>
  </button>
);

export default function App() {
// --- AUTH STATES ---
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isRegister, setIsRegister] = useState(false);
const [adminCode, setAdminCode] = useState("");

const [loginData, setLoginData] = useState({ 
  name: '', 
  email: '', 
  whatsapp: '', 
  role: 'member' 
});

const [users, setUsers] = useState(() => {
  const saved = localStorage.getItem("users");
  return saved ? JSON.parse(saved) : [];
});

const [currentUserId, setCurrentUserId] = useState(null);
const [role, setRole] = useState('member'); 

// --- USE EFFECT ---
useEffect(() => {
  localStorage.setItem("users", JSON.stringify(users));
}, [users]);


const handleRegister = (e) => {
  e.preventDefault();

  if (loginData.role === "admin" && adminCode !== "SURYAKANTA0326") {
    alert("Kode admin salah");
    return;
  }

const userExists = users.find((u) => u.email === loginData.email);

  if (userExists) {
    alert("Email sudah terdaftar");
    return;
  }

const newUser = {
  id: Date.now(),
  name: loginData.name,
  email: loginData.email,
  whatsapp: loginData.whatsapp,
  role: loginData.role,
  photo: "",
  address: "",
  birthPlace: "",
  birthDate: "",
  hobby: "",
  motivation: ""
};

  setUsers([...users, newUser]);
  alert("Pendaftaran berhasil, silakan login");
  setIsRegister(false);
};

// --- APP STATES ---
const [activeTab, setActiveTab] = useState('dashboard');
const [sidebarOpen, setSidebarOpen] = useState(false);
const [books, setBooks] = useState(INITIAL_BOOKS);
const members = users.filter(user => user.role === "member");


// HAPUS MEMBER
  function deleteMember(id) {
    if (window.confirm("Hapus member ini?")) {
      const updatedUsers = users.filter((u) => u.id !== id);
      setUsers(updatedUsers);
    }
  }

// EDIT MEMBER
const editMember = (id) => {
  const newEmail = prompt("Masukkan email baru:");
  const newWhatsapp = prompt("Masukkan nomor WhatsApp baru:");

  if (!newEmail || !newWhatsapp) return;

  const updatedUsers = users.map((u) =>
    u.id === id ? { ...u, email: newEmail, whatsapp: newWhatsapp } : u
  );

  setUsers(updatedUsers);
};
  const [searchTerm, setSearchTerm] = useState("");
  
  const [infoPoster, setInfoPoster] = useState("https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000");
  const [infoNote, setInfoNote] = useState("Selamat datang di SuryakantaLib. Harap menjaga ketenangan selama berada di area perpustakaan.");
  const [infoService, setInfoService] = useState("Senin - Jumat: 08:00 - 20:00\nSabtu: 09:00 - 15:00\nMinggu & Hari Libur: Tutup");

  const [selectedBook, setSelectedBook] = useState(null);
  const [profile, setProfile] = useState({
  name: "",
  email: "",
  whatsapp: "",
  photo: "",
  address: "",
  birthPlace: "",
  birthDate: "",
  hobby: "",
  motivation: ""
});
  
  const [selectedMemberProfile, setSelectedMemberProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [formData, setFormData] = useState({
    cover: '', title: '', author: '', publisher: '', 
    year: '', isbn: '', pages: '', desc: '', price: '', tag: ''
  });
  const [coverPreview, setCoverPreview] = useState("");

  // --- HANDLERS ---
  // SIMPAN PROFIL
  const saveProfile = () => {

    const updatedUsers = users.map((u) =>
      u.id === currentUserId ? { ...u, ...profile } : u
    );

    setUsers(updatedUsers);

    alert("Profil berhasil disimpan");

  };
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  
  const handleCoverUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setFormData({
      ...formData,
      cover: reader.result
    });

    setCoverPreview(reader.result);
  };

  reader.readAsDataURL(file);
};
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const foundUser = users.find((u) => u.email === loginData.email);

    if (!foundUser) {
    alert("User tidak ditemukan, silakan daftar terlebih dahulu.");
    return;
  }

    setCurrentUserId(foundUser.id);
    setRole(foundUser.role);
    setProfile({
  ...foundUser,
  photo: foundUser.photo || `https://ui-avatars.com/api/?name=${foundUser.name.replace(" ", "+")}&background=${foundUser.role === 'admin' ? '4F46E5' : '10B981'}&color=fff`
});
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if(window.confirm("Keluar dari sistem?")) {
        setIsLoggedIn(false);
        setActiveTab('dashboard');
        setLoginData({ name: '', email: '', whatsapp: '', role: 'member' });
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = (e, callback) => {
    // SIMPAN PROFIL MEMBER
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      callback(url);
    }
  };

  // UPLOAD FOTO PROFIL
    const handleProfilePhoto = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          photo: reader.result
        });
      };
      reader.readAsDataURL(file);
    };

  const saveBook = (e) => {
    e.preventDefault();
    if (isEditing) {
      setBooks(books.map(b => b.id === currentBookId ? { ...formData, id: currentBookId, price: Number(formData.price) } : b));
    } else {
      setBooks([{ ...formData, id: Date.now(), status: "Tersedia", price: Number(formData.price) }, ...books]);
    }
    setIsModalOpen(false);
  };

  const deleteBook = (id) => { if(window.confirm("Hapus buku?")) setBooks(books.filter(b => b.id !== id)); };
  // TOGGLE RECOMMENDATION
  const toggleRecommendation = (id) => {
  const updatedBooks = books.map((b) =>
    b.id === id ? { ...b, recommended: !b.recommended } : b
  );

  setBooks(updatedBooks);
};

  const updateBorrowStatus = (bookId, newStatus) => {
    const today = new Date();
    const returnDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
    const updatedBooks = books.map(b => {
      if (b.id === bookId) {
        return { 
          ...b, status: newStatus, 
          returnDate: newStatus === "Dipinjam" ? returnDate : "",
          borrowerId: newStatus === "Dipinjam" ? currentUserId : null 
        };
      }
      return b;
    });
    setBooks(updatedBooks);
    if (selectedBook && selectedBook.id === bookId) setSelectedBook(updatedBooks.find(b => b.id === bookId));
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
// DERIVED DATA
  const totalBookValue = useMemo(() => books.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0), [books]);

  const totalBookCount = books.length;

// KELOMPOK BUKU BERDASARKAN TAG (Bookshelf)
const booksByTag = useMemo(() => {
  const grouped = {};
  books.forEach((book) => {
    const tag = book.tag ? book.tag : "Uncategorized";
    if (!grouped[tag]) {
      grouped[tag] = [];
    }
    grouped[tag].push(book);
  });
  return grouped;
}, [books]);

// --- LOGIN VIEW ---
if (!isLoggedIn) {
  return (
    <div className="min-h-screen flex items-end justify-center md:justify-end pb-10 p-4 md:p-10 bg-cover bg-center
      bg-[url('src/Geminiflowership.png')]
      md:bg-[url('src/Gemini_generated_image.png')]"
>
    <div className="bg-white w-[90%] max-w-[220px] sm:max-w-[260px] md:max-w-sm rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[#ce5007] p-3 md:p-4 text-[#1A1A1A] text-center">
        <h1 className="text-xl md:text-3xl font-serif font-bold"> Suryakanta<span className="opacity-90">Lib.</span>
        </h1>
          <p className="text-indigo-100 text-xs md:text-sm mt-1">
            Sistem Verifikasi Akses Perpustakaan
          </p>
        </div>

        <form
          onSubmit={isRegister ? handleRegister : handleLoginSubmit}
          className="p-3 md:p-5 space-y-1">

          {/* ROLE SELECT */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() =>
                setLoginData({ ...loginData, role: "member" })
              }
              className={`flex-1 flex items-center justify-center gap-1 py-2 md:py-3 rounded-xl text-xs font-bold transition-all ${
                loginData.role === "member"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-400"
              }`}
            >
              <UserCheck size={16} /> Member
            </button>

            <button
              type="button"
              onClick={() =>
                setLoginData({ ...loginData, role: "admin" })
              }
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                loginData.role === "admin"
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-gray-400"
              }`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          {/* NAMA */}
          <div className="space-y-1">
            <label className="text-[8px] md:text-[10px] font-bold text-[#1A1A1A] uppercase ml-1 md:ml-2">
              Nama Lengkap
            </label>
            <input
              required
              name="name"
              value={loginData.name}
              onChange={handleLoginChange}
              placeholder="Masukkan nama"
              className="w-full p-1 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs md:text-sm"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-[8px] md:text-[10px] font-bold text-[#1A1A1A] uppercase ml-1 md:ml-2">
              Email Aktif
            </label>
            <input
              required
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="nama@gmail.com"
              className="w-full p-1 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs md:text-sm"
            />
          </div>

          {/* WHATSAPP */}
          <div className="space-y-1">
            <label className="text-[8px] md:text-[10px] font-bold text-[#1A1A1A] uppercase ml-1 md:ml-2">
              Nomor WhatsApp
            </label>
            <input
              required
              name="whatsapp"
              value={loginData.whatsapp}
              onChange={handleLoginChange}
              placeholder="08xxxx"
              className="w-full p-1 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs md:text-sm"
            />
          </div>

          {/* KODE ADMIN (MUNCUL SAAT REGISTER ADMIN) */}
          {loginData.role === "admin" && isRegister && (
            <div className="space-y-1">
              <label className="text-[6px] md:text-[10px] font-bold text-[#1A1A1A] uppercase ml-1 md:ml-2">
                Kode Admin
              </label>
              <input
                type="text"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Masukkan kode admin"
                className="w-full p-1 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs md:text-sm"
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#ce5007] text-white py-2.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-[#993a04] transition-all mt-2 md:mt-4 group"
          >
            Masuk Sekarang
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {/* SWITCH LOGIN REGISTER */}
          <div className="text-center text-xs md:text-sm mt-3 md:mt-4">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}

            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-600 font-bold ml-2"
            >
              {isRegister ? "Login" : "Daftar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN APP VIEW ---
  return (
    <div className="flex min-h-screen bg-[#fdfdfd] text-[#1A1A1A]">
      
    {/* SIDEBAR */}
    <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col z-40 shadow-sm transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex`}>
        <button
        onClick={() => setSidebarOpen(false)}
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-black text-xl">
        ✕
      </button>
        <div className="p-8 text-2xl font-serif font-bold text-indigo-600 tracking-tight">
          Suryakanta<span className="text-gray-900">Lib.</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutGrid size={20}/>} label="Dashboard" id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<BookIcon size={20}/>} label="Bookshelf" id="bookshelf" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<BookOpen size={20}/>} label="Trending Reads" id="library" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<Lightbulb size={20}/>} label="Recommendations" id="history" activeTab={activeTab} setActiveTab={setActiveTab} />
          {role === 'admin' && <NavItem icon={<Users size={20}/>} label="Member" id="members" activeTab={activeTab} setActiveTab={setActiveTab} />}
          <div className="pt-8 pb-2 text-[10px] font-bold text-gray-400 uppercase px-4 tracking-widest">System</div>
          <NavItem icon={<Info size={20}/>} label="Information" id="info" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<User size={20}/>} label="Profile" id="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
        <div className="p-4 border-t border-gray-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all">
            <LogOut size={20}/> <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between border-b border-gray-100">
          <div className="relative w-96">
            <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 mr-3 rounded-xl hover:bg-gray-100 text-xl"
          >
            ☰
          </button>
            <input 
              type="text" placeholder="Cari bukumu..."
              className="w-full pl-4 pr-4 py-2.5 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-none">{profile.name}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{role}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 overflow-hidden shadow-lg border-2 border-white">
              <img src={profile.photo} className="w-full h-full object-cover" alt="User" />
            </div>
          </div>
        </header>

        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          
          {role === "member" && profile.motivation && (
          <div className="bg-indigo-50 p-6 rounded-3xl mb-6 border border-indigo-100">
            <p className="text-xs font-bold text-indigo-500 uppercase mb-1">
              Motivasi Membaca
            </p>
            <p className="text-indigo-900 font-medium italic">
              "{profile.motivation}"
            </p>
          </div>
        )}
      {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-xl md:text-3xl font-serif font-bold">Koleksi Buku Suryakanta</h1>
                  <p className="text-gray-500 italic">Temukan bacaan favorit Anda.</p>
                </div>
                {role === 'admin' && (
                  <button onClick={() => { setIsEditing(false); setFormData({cover:'',title:'',author:'',publisher:'',year:'',isbn:'',pages:'',desc:'',price:''}); setCoverPreview(""); setIsModalOpen(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    <Plus size={20}/> Tambah Buku
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
                {filteredBooks.map(book => (
                  <div key={book.id} onClick={() => setSelectedBook(book)} className="bg-white p-2 md:p-4 rounded-2xl md:rounded-[32px] shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-indigo-100 cursor-pointer">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative bg-gray-100 shadow-inner">
        {/* RECOMMEND STAR */}
                  {role === "admin" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRecommendation(book.id);
                      }}
                      className="absolute top-2 left-2 z-20 p-1 bg-white/80 rounded-full shadow hover:scale-110 transition"
                    >
                      <Star
                        size={18}
                        className={
                          book.recommended
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }
                      />
                    </button>
                  )}

                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {role === 'admin' && (
                        <div className="absolute top-2 right-2 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => { setIsEditing(true); setCurrentBookId(book.id); setFormData({...book}); setCoverPreview(book.cover); setIsModalOpen(true); }} className="p-2.5 bg-white/90 rounded-xl text-blue-600 shadow hover:bg-blue-600 hover:text-white transition-all"><Edit size={16}/></button>
                          <button onClick={() => deleteBook(book.id)} className="p-2.5 bg-white/90 rounded-xl text-red-600 shadow hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-xs md:text-lg leading-tight truncate">{book.title}</h3>
                    <p className="text-[10px] md:text-sm text-gray-400 mb-2">{book.author}</p>
                    {book.borrowerId && (
  <p className="text-xs text-indigo-500 font-medium">
    Dipinjam oleh: {users.find(u => u.id === book.borrowerId)?.name}
  </p>
)}
                    <div className="flex justify-between items-center border-t pt-3 border-gray-50 mt-auto">
                        <span className={`text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-lg ${book.status === 'Tersedia' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {book.status}
                        </span>
                        <span className="text-[10px] md:text-xs font-black text-indigo-600">Rp {book.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-8 animate-in fade-in duration-500">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-4 rounded-[40px] shadow-sm relative group overflow-hidden">
                  <img src={infoPoster} className="w-full h-[500px] object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-105" alt="Poster" />
                  {role === 'admin' && (
                    <label className="absolute bottom-10 right-10 p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl cursor-pointer hover:bg-indigo-700 transition-all flex items-center gap-2">
                      <Camera size={20}/>
                      <span className="text-sm font-bold">Ganti Gambar Poster</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setInfoPoster)} />
                    </label>
                  )}
                </div>
                <div className="bg-white p-8 rounded-[40px] shadow-sm">
                  <h3 className="font-serif font-bold text-xl mb-4 text-indigo-600 flex items-center gap-2">
                    <Lightbulb size={24}/> Pengumuman Perpustakaan
                  </h3>
                  {role === 'admin' ? (
                    <textarea 
                      className="w-full bg-gray-50 p-6 rounded-3xl outline-none text-sm border-none focus:ring-2 focus:ring-indigo-100 transition-all" 
                      rows="4" 
                      value={infoNote} 
                      onChange={(e) => setInfoNote(e.target.value)}
                      placeholder="Tulis pengumuman di sini..."
                    />
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <p className="text-gray-600 italic leading-relaxed whitespace-pre-line">"{infoNote}"</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-6">

  {/* TOTAL KOLEKSI BUKU */}
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
      Total Koleksi Buku
    </p>
    <h2 className="text-4xl font-black text-indigo-600">
      {totalBookCount}
    </h2>
  </div>

  {/* TOTAL NILAI BUKU */}
  <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100">
    <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-2">
      Estimasi Nilai Buku
    </p>
    <h2 className="text-4xl font-black">
      Rp {totalBookValue.toLocaleString()}
    </h2>
  </div>

</div>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-indigo-50">
                  <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <Clock size={20} className="text-indigo-600"/> Jam Operasional
                  </h4>
                  {role === 'admin' ? (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase ml-1">Edit Informasi Layanan</p>
                      <textarea 
                        className="w-full bg-gray-50 p-5 rounded-3xl border-none outline-none text-sm focus:ring-2 focus:ring-indigo-100" 
                        rows="5"
                        value={infoService} 
                        onChange={(e) => setInfoService(e.target.value)}
                        placeholder="Contoh: Senin - Jumat 08:00..."
                      />
                    </div>
                  ) : (
                    <div className="bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100/50">
                      <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-line font-medium">
                        {infoService}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: BOOKSHELF */}
{activeTab === "bookshelf" && (
  <div className="space-y-10">

    <h2 className="text-lg md:text-2xl font-serif font-bold">
      Rak Buku Berdasarkan Kategori
    </h2>

    {Object.keys(booksByTag).map((tag) => (
      
      <div key={tag} className="space-y-4">

        <h3 className="text-lg font-bold text-indigo-600">
          {tag}
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">

          {booksByTag[tag].map((book) => (
            
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="bg-white p-4 rounded-[24px] shadow-sm hover:shadow-lg transition cursor-pointer"
            >

              <img
                src={book.cover}
                className="w-full aspect-[3/4] object-cover rounded-xl mb-2"
              />

              <p className="font-bold text-sm truncate">
                {book.title}
              </p>

              <p className="text-xs text-gray-400">
                {book.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}

          {/* TAB: LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <h2 className="text-lg md:text-2xl font-serif font-bold">Sedang Tren di Suryakanta</h2>
             <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
                {books.filter(b => b.status === "Dipinjam").length > 0 ? (
                  books.filter(b => b.status === "Dipinjam").map(book => (
                    <div key={book.id} onClick={() => setSelectedBook(book)} className="bg-white p-6 rounded-[32px] flex gap-6 shadow-sm border border-orange-100 cursor-pointer hover:shadow-md transition-all">
                      <img src={book.cover} className="w-32 h-44 object-cover rounded-2xl shadow-md" alt={book.title} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-xl">{book.title}</h3>
                          <Clock className="text-orange-400" size={20} />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100/50">
                          <p className="text-[10px] font-bold text-orange-700 uppercase tracking-widest">Batas Waktu Kembali</p>
                          <p className="text-sm font-black text-orange-900">{book.returnDate || "Segera"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 italic">Belum ada buku yang dipinjam saat ini.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* TAB: RECOMMENDATIONS */}
{activeTab === "history" && (
  <div className="space-y-6">
    <h2 className="text-lg md:text-2xl font-serif font-bold">
      Buku Rekomendasi Suryakanta
    </h2>

    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">

      {books.filter((b) => b.recommended).length > 0 ? (
        books
          .filter((b) => b.recommended)
          .map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="bg-white p-4 rounded-[32px] shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={book.cover}
                className="w-full aspect-[3/4] object-cover rounded-2xl mb-3"
              />

              <h3 className="font-bold">{book.title}</h3>
              <p className="text-sm text-gray-400">{book.author}</p>

              <div className="mt-2 text-yellow-500 font-bold">
                ⭐ Recommended
              </div>
            </div>
          ))
      ) : (
        <div className="col-span-4 text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
          <p className="text-gray-400 italic">
            Belum ada buku rekomendasi.
          </p>
        </div>
      )}

    </div>
  </div>
)}

          {/* TAB: MEMBERS (ADMIN ONLY) */}
          {activeTab === 'members' && role === 'admin' && (
            <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-50">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b">
                  <tr><th className="p-6">Member</th><th className="p-6">Kontak</th><th className="p-6">Peminjaman</th><th className="p-6">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50/30 transition-all">
                      <td className="p-6">
                        <td className="p-6 flex items-center gap-3">

                      <img
                      src={m.photo || `https://ui-avatars.com/api/?name=${m.name}`}
                      className="w-10 h-10 rounded-xl object-cover"
                      />

                      <div>
                      <p
                      className="font-bold cursor-pointer text-indigo-600"
                      onClick={()=>setSelectedMemberProfile(m)}
                      >
                      {m.name}
                      </p>

                      <p className="text-xs text-gray-400">
                      #{m.id}
                      </p>
                      </div>


                      </td>
                    <p className="text-xs text-gray-400">#{m.id}</p></td>
                      <td className="p-6"><p className="text-sm">{m.email}</p><p className="text-sm text-green-600 font-medium">{m.whatsapp}</p></td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          {books.filter(b => b.borrowerId === m.id && b.status === "Dipinjam").map(b => (
                            <span key={b.id} className="text-[10px] px-3 py-1 rounded-full font-bold bg-indigo-50 text-indigo-600 w-fit">{b.title}</span>
                          ))}
                          {books.filter(b => b.borrowerId === m.id && b.status === "Dipinjam").length === 0 && <span className="text-xs text-gray-300">-</span>}
                        </div>
                      </td>
                      <td className="p-6 flex gap-2">

  {/* EDIT MEMBER */}
  <button
    onClick={() => editMember(m.id)}
    className="text-[10px] bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
  >
    Edit
  </button>

  {/* HAPUS MEMBER */}
  <button
    onClick={() => deleteMember(m.id)}
    className="text-[10px] bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
  >
    Hapus
  </button>

  {/* SELESAIKAN PINJAMAN */}
  {books.filter(b => b.borrowerId === m.id && b.status === "Dipinjam").map(b => (
    <button
      key={b.id}
      onClick={() => updateBorrowStatus(b.id, "Tersedia")}
      className="text-[10px] bg-green-50 text-green-600 px-4 py-2 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-all"
    >
      Selesaikan
    </button>
  ))}

</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
          <div className="mt-10 w-full space-y-6">

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
              {/* FOTO PROFIL */}
            <div className="flex justify-center mb-6">

            <label className="cursor-pointer relative group">

            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg bg-gray-100">

            <img
            src={profile.photo}
            className="w-full h-full object-cover"
            />

            </div>

            <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhoto}
            className="hidden"
            />

            </label>

            </div>
            Nama
            </label>
            <input
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.name}
            readOnly
            />
            </div>

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Email
            </label>
            <input
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.email}
            readOnly
            />
            </div>

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            WhatsApp
            </label>
            <input
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.whatsapp}
            readOnly
            />
            </div>

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Alamat
            </label>
            <input
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.address || ""}
            onChange={(e)=>setProfile({...profile,address:e.target.value})}
            />
            </div>

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Tempat Lahir
            </label>
            <input
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.birthPlace || ""}
            onChange={(e)=>setProfile({...profile,birthPlace:e.target.value})}
            />
            </div>

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Tanggal Lahir
            </label>
            <input
            type="date"
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.birthDate || ""}
            onChange={(e)=>setProfile({...profile,birthDate:e.target.value})}
            />
            </div>

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Hobi
            </label>
            <input
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.hobby || ""}
            onChange={(e)=>setProfile({...profile,hobby:e.target.value})}
            />
            </div>

            <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Motivasi
            </label>
            <textarea
            className="w-full bg-gray-50 p-4 rounded-2xl"
            value={profile.motivation || ""}
            onChange={(e)=>setProfile({...profile,motivation:e.target.value})}
            />
            </div>
            <button
            onClick={saveProfile}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition"
            >
            Simpan Profil
            </button>
          </div>
          )}

          {selectedMemberProfile && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120]">

            <div className="bg-white p-10 rounded-[40px] w-[500px]">

            <h2 className="text-lg md:text-2xl font-serif font-bold">
            Profil Member
            </h2>

            <p><b>Nama:</b> {selectedMemberProfile.name}</p>
            <p><b>Email:</b> {selectedMemberProfile.email}</p>
            <p><b>WhatsApp:</b> {selectedMemberProfile.whatsapp}</p>
            <p><b>Alamat:</b> {selectedMemberProfile.address || "-"}</p>
            <p><b>Tempat Lahir:</b> {selectedMemberProfile.birthPlace || "-"}</p>
            <p><b>Tanggal Lahir:</b> {selectedMemberProfile.birthDate || "-"}</p>
            <p><b>Hobi:</b> {selectedMemberProfile.hobby || "-"}</p>
            <p><b>Motivasi:</b> {selectedMemberProfile.motivation || "-"}</p>

            <button
            onClick={()=>setSelectedMemberProfile(null)}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-xl"
            >
            Tutup
            </button>

            </div>
            <button
            onClick={saveProfile}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition"
            >
            Simpan Profil
            </button>
            </div>
            )}

          {/* MODAL DETAIL BUKU */}
          {selectedBook && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className="bg-white w-full max-w-4xl rounded-[50px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-2/5 bg-gray-50 p-10 flex items-center justify-center">
                  <img src={selectedBook.cover} className="w-full aspect-[3/4] object-cover rounded-[32px] shadow-2xl" alt={selectedBook.title} />
                </div>
                <div className="md:w-3/5 p-10 relative">
                  <button onClick={() => setSelectedBook(null)} className="absolute top-6 right-6 p-3 hover:bg-gray-100 rounded-2xl transition-all">
                    <X size={24}/>
                  </button>
                  <div className="mb-6">
                    <span className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest ${selectedBook.status === 'Tersedia' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {selectedBook.status}
                    </span>
                    <h2 className="text-4xl font-serif font-bold mt-4 leading-tight">{selectedBook.title}</h2>
                    <p className="text-xl text-indigo-600 font-medium mt-1">{selectedBook.author}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Penerbit</p>
                      <p className="font-bold text-gray-700">{selectedBook.publisher}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Tahun</p>
                      <p className="font-bold text-gray-700">{selectedBook.year}</p>
                    </div>
                     {/* TAG BUKU */}
                    <div className="bg-indigo-50 p-4 rounded-2xl col-span-2">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase">
                        Kategori Buku
                      </p>

                      <p className="font-bold text-indigo-700">
                        {selectedBook.tag || "Tidak ada kategori"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><BookIcon size={16}/> Deskripsi</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{selectedBook.desc || "Tidak ada deskripsi."}</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Harga Aset</p>
                      <p className="text-2xl font-black text-indigo-600">Rp {selectedBook.price.toLocaleString()}</p>
                    </div>
                    {role === 'member' ? (
                      selectedBook.status === 'Tersedia' ? (
                        <button onClick={() => updateBorrowStatus(selectedBook.id, "Dipinjam")} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-green-700 transition-all">Pinjam Sekarang</button>
                      ) : (
                        <button disabled className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold opacity-80 cursor-not-allowed">Sudah Dipinjam</button>
                      )
                    ) : (
                      <div className="flex gap-2">
                         <button onClick={() => updateBorrowStatus(selectedBook.id, "Tersedia")} className={`px-6 py-4 rounded-2xl font-bold transition-all ${selectedBook.status === 'Tersedia' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>Tersedia</button>
                         <button onClick={() => updateBorrowStatus(selectedBook.id, "Dipinjam")} className={`px-6 py-4 rounded-2xl font-bold transition-all ${selectedBook.status === 'Dipinjam' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>Dipinjam</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL TAMBAH / EDIT BUKU */}
{isModalOpen && (
  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">

      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl"
      >
        <X size={20}/>
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Buku" : "Tambah Buku"}
      </h2>

      <form onSubmit={saveBook} className="grid grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-2">
        
        {/* COVER */}
<div className="col-span-2 flex justify-center mb-4">

  <label className="relative cursor-pointer group">

    <div className="w-40 h-56 bg-gray-100 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
      {(coverPreview || formData.cover) ? (
        <img
          src={coverPreview || formData.cover}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      ) : (
        <Plus size={40} className="text-gray-400" />
      )}
    </div>

    <input
      type="file"
      accept="image/*"
      onChange={handleCoverUpload}
      className="hidden"
      required={!isEditing}
    />
  </label>
</div>

        <input
          name="title"
          placeholder="Judul Buku"
          value={formData.title}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
          required={!isEditing}
        />

        <input
          name="author"
          placeholder="Penulis"
          value={formData.author}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
          required={!isEditing}
        />

        <input
          name="publisher"
          placeholder="Penerbit"
          value={formData.publisher}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
          required={!isEditing}
        />

        <input
          name="year"
          placeholder="Tahun"
          value={formData.year}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
          required={!isEditing}
        />

        <input
          name="isbn"
          placeholder="ISBN"
          value={formData.isbn}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
          required={!isEditing}
        />

        <input
          name="pages"
          placeholder="Jumlah Halaman"
          value={formData.pages}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
          required={!isEditing}
        />

        <input
          name="price"
          type="number"
          placeholder="Harga Buku"
          value={formData.price}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
          required={!isEditing}
        />
        <input
          name="tag"
          placeholder="Tag / Kategori (contoh: Novel, Sejarah, Filsafat)"
          value={formData.tag}
          onChange={handleInputChange}
          className="p-3 bg-gray-50 rounded-xl"
        />
        <div className="col-span-2 flex justify-center mb-4">

  <label className="relative cursor-pointer group">
  </label>
</div>

        <textarea
          name="desc"
          placeholder="Deskripsi Buku"
          value={formData.desc}
          onChange={handleInputChange}
          rows="3"
          className="p-3 bg-gray-50 rounded-xl col-span-2"
        />

        <button
          type="submit"
          className="col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          {isEditing ? "Simpan Perubahan" : "Tambah Buku"}
        </button>

      </form>
    </div>
  </div>
)}

        </div>
      </main>
    </div>
  );
}
