import React from 'react'

const NewsLetter = () => {
  return (
    <div className='flex-nowrap flex-1 flex items-center justify-center mb-10'>
        <section class="bg-black flex flex-col items-center text-white rounded-2xl min-w-3xl ">
    <div class="flex flex-col items-center mt-10">
        <h2 class="text-center text-4xl font-semibold max-w-2xl">Subscribe <span class="bg-gradient-to from-indigo-600 to-black p-1 bg-left inline-block bg-no-repeat">newsletter</span></h2>
        <p class="text-center text-slate-400 max-w-lg mt-3">A curated showcase of our finest stays — each destination designed to offer comfort, luxury, and unforgettable experiences.</p>
    </div>
    <div class="flex items-center justify-center mt-10 mb-10 border border-slate-700 focus-within:outline focus-within:outline-indigo-600 text-sm rounded-full h-14 max-w-xl w-full">
        <input class="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-slate-400" placeholder="Enter your email address" type="text" />
        <button class="bg-indigo-600 text-white rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition">Subscribe</button>
    </div>
</section>
    </div>
  )
}

export default NewsLetter