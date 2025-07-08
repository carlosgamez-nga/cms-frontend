interface BannerProps {
  users_name: string;
}

const Banner = ({ users_name }: BannerProps) => {
  return (
    <div className='flex flex-col bg-gradient px-60 pt-20 pb-14 -mx-8 mb-8'>
      <div className='lg:mx-35'>
        <h2 className='text-4xl text-primary'>Hello {users_name}!</h2>
        <p className='text-secondary-foreground'>
          Get Ready to get some contract insights
        </p>
      </div>
    </div>
  );
};

export default Banner;
