import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-400 via-blue-800 to-blue-200 w-full mt-auto">
            <div className="container mx-auto text-center py-3 space-y-1">
                <div className="text-gray-100 font-semibold text-lg">Made by Pratiksha Sankhe</div>
                <div className="flex justify-center items-center gap-6 mt-2">
                    <a
                        href="mailto:sankhepratiksha3@gmail.com"
                        className="text-blue-100 hover:text-white underline transition"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        sankhepratiksha3@gmail.com
                    </a>
                    <span className="text-blue-300">|</span>
                    <a
                        href="https://www.linkedin.com/in/pratiksha-sankhe"
                        className="text-blue-100 hover:text-white underline transition"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}