const Footer = () => {
    return (
        <footer className="flex flex-row items-center justify-center pb-6">
            <a href="https://docs.metamask.io/" target="_blank" rel="noopener noreferrer"
                className="flex flex-row items-center justify-center">
                <img src='/assets/metamask_fox.svg' style={{ width: "24px", height: "24px", marginRight: "10px" }} />
                <div>
                    <span>Powered by MetaMask</span>
                </div>
            </a>
        </footer>
    );
};

export default Footer;