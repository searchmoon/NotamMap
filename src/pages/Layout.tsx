function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: "1400px",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}

export default Layout;
