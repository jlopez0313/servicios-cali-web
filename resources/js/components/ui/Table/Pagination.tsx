import { Link } from "@inertiajs/react";

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageLinkProps = {
    active: boolean;
    label: string;
    url: string;
    onNavigate?:  (url: string) => void;
};

type PageInactiveProps = {
    label: string;
};

export const Pagination = ({ links = [], onNavigate }: { links: PaginationLink[], onNavigate?: (url: string) => void; }) => {

    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-baseline mt-6 gap-1">
            {links.map(({ active, label, url }, index) => (
                <div key={index}>
                    {url ? (
                        <PageLink active={active} label={label} url={url} onNavigate={onNavigate} />
                    ) : (
                        <PageInactive label={label} />
                    )}
                </div>
            ))}
        </div>
    );
};

const PageLink = ({ active, label, url, onNavigate }: PageLinkProps) => {
    const baseClasses = [
        "mr-1 mb-1",
        "px-4 py-3",
        "border border-solid border-gray-300 rounded",
        "text-sm",
        "hover:bg-white",
        "focus:outline-none focus:border-indigo-700 focus:text-indigo-700",
        "transition-colors duration-200",
    ];

    const activeClasses = active ? "bg-gray-100 font-medium" : "";

    const handleClick = (e: React.MouseEvent) => {
        if (onNavigate){
            e.preventDefault();
            onNavigate(url);
        }
    };

    return (
        <Link
            className={`${baseClasses.join(" ")} ${activeClasses}`}
            href={url}
            onClick={handleClick}
            preserveScroll
        >
            <SafeHtml content={label} />
        </Link>
    );
};

const PageInactive = ({ label }: PageInactiveProps) => {
    return (
        <div className="mr-1 mb-1 px-4 py-3 text-sm border rounded border-solid border-gray-300 text-gray-400">
            <SafeHtml content={label} />
        </div>
    );
};

const SafeHtml = ({ content }: { content: string }) => {
    const cleanHtml = content.replace(/<\/?script.*?>/gi, "");

    return <span dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};