/**
 * Layout
 * Frontend layout module for Echelon Living app.
 */
import type { PropsWithChildren } from "react";
import Navbar from "../ui/Navbar";
import Footer from "./Footer";
import "../../styles/layout/Layout.css";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout-shell">
      <Navbar />
      <div className="layout-main">
        <div className="layout-container layout-main-content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
