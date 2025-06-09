const Gradient = () => {
  return (
    <>
      <div className='blob w-[800px] h-[800px] rounded-[999px] absolute top-0 right-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-[#E0E1FF] via-[#E8F7FD] to-[#EDFCF9]'></div>
      <div className='blob w-[1000px] h-[1000px] rounded-[999px] absolute bottom-0 left-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-[#FDF0E8] via-[#E0DFE5] to-[#E8F7FD]'></div>
      <div className='blob w-[600px] h-[600px] rounded-[999px] absolute bottom-0 left-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-[#FDF6E8] via-[#EDFCF9] to-[#E8F7FD]'></div>
      <div className='blob w-[300px] h-[300px] rounded-[999px] absolute bottom-[-10px] left-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-[#EDFCF9] via-[#E8F7FD] to-[#E0E1FF]'></div>
    </>
  );
};

export default Gradient;
