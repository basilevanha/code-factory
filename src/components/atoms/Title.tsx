type TitleProps = {
  children: React.ReactNode;
};

function Title({ children }: TitleProps) {
  return <h1 className="mb-8 text-center text-4xl font-bold">{children}</h1>;
}

export default Title;
