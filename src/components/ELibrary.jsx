import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Search, 
  Download, 
  Eye, 
  Filter, 
  BookOpen, 
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const ELibrary = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['All', 'Science', 'Mathematics', 'Literature', 'History', 'Technology', 'Fiction'];

  const fetchBooks = async () => {
    setIsLoading(true);
    let query = supabase.from('books').select('*');
    
    if (activeCategory !== 'All') {
      query = query.eq('category', activeCategory);
    }

    const { data } = await query.order('title');
    if (data) setBooks(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [activeCategory]);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Featured Header */}
      <div className="relative overflow-hidden glass rounded-[2.5rem] p-12 border border-white/5 bg-gradient-to-br from-blue-600/[0.05] to-indigo-600/[0.05]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
            <Star size={14} className="fill-blue-400" /> DIGITAL REPOSITORY
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Explore the Digital Knowledge Base</h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">Access academic resources, research papers, and textbook references for your curriculum.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-1 flex items-center glass-input rounded-2xl px-6 py-4 gap-4 border border-white/10 shadow-2xl">
                <Search size={20} className="text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search by book title or author..." 
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-600" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
                Find Resources
             </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <BookOpen size={240} className="text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left: Categories & Filters */}
        <div className="xl:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-400/20' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                  <ChevronRight size={14} className={activeCategory === cat ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/5 bg-emerald-500/[0.02]">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-emerald-400" /> Circulation Status
             </h3>
             <div className="space-y-4">
                {[
                   { label: 'Books Issued', val: '124' },
                   { label: 'Overdue Books', val: '08' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03]">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className="text-sm font-bold text-white">{item.val}</span>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10">
                Manage Issues
             </button>
          </div>
        </div>

        {/* Right: Book Grid */}
        <div className="xl:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{activeCategory} Catalog</h3>
            <div className="flex gap-2">
               <button className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/10 flex items-center gap-2">
                  <Plus size={16} /> Add Book
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
               <div className="col-span-full py-20 text-center text-slate-500 italic">Accessing digital library archives...</div>
            ) : filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-[2rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all group"
              >
                <div className={`h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative`}>
                   <BookOpen size={48} className="text-blue-500/20 group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold px-2 py-1 rounded-full border border-emerald-500/20">
                      COPY: {book.available_copies}/{book.total_copies}
                   </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">{book.category}</p>
                    <h4 className="text-sm font-bold text-white line-clamp-2 min-h-[40px] leading-snug group-hover:text-blue-400 transition-colors uppercase tracking-tight">{book.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">By {book.author}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1">
                       <Star size={10} className="fill-amber-400 text-amber-400" />
                       <span className="text-[10px] font-bold text-white">4.8</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">PDF / E-BOOK</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 hover:text-white transition-all">
                       Preview
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600/10 text-blue-400 text-[10px] uppercase tracking-widest font-bold hover:bg-blue-600 hover:text-white transition-all">
                       <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {!isLoading && filteredBooks.length === 0 && (
               <div className="col-span-full py-20 text-center text-slate-500 italic">No books matching your criteria.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELibrary;
