import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import React from "react";
import { Icon } from "../icon";

export const Table: React.FC<any> = ({
    user = {},
    caption = "",
    data = [],
    titles = [],
    actions = [],
    onRow = () => {},
    onSort = () => {},
    sortIcon = "desc",
}) => {
    return (
        <table className="w-full whitespace-nowrap">
            <caption>
                <h1 className='font-bold'> {caption} </h1>
            </caption>

            <thead>
                <tr className="font-bold text-left">
                    {titles.map((title: string | any, key: number) => {
                        return (
                            <th className="px-6 pt-5 pb-4" key={key}>
                                {title.key ? (
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => onSort(title.key)}
                                    >
                                        <span> {title.title} </span>
                                        <Icon
                                            iconNode={sortIcon == 'asc' ? ChevronUp : ChevronDown}
                                            className="flex-shrink-0 w-3 h-3 ml-2 fill-current"
                                        />
                                    </div>
                                ) : (
                                    <span> {title} </span>
                                )}
                            </th>
                        );
                    })}
                    <th className="px-6 pt-5 pb-4"> </th>
                </tr>
            </thead>
            <tbody>
                {data.map((item: any, key: number) => {
                    if (
                        item?.roles_adm?.length &&
                        !item.roles_adm.includes(user?.rol?.slug)
                    )
                        return;
                    return (
                        <tr
                            key={key}
                            className="hover:bg-gray-100 focus-within:bg-gray-100"
                            id={key.toString()}
                        >
                            {Object.keys(item).map((key, idx) => {
                                if (
                                    key == "id" ||
                                    key == "ruta" ||
                                    key == "estado" ||
                                    key == "roles_adm"
                                )
                                    return;
                                return (
                                    <td className="border-t" key={key}>
                                        <a
                                            role="button"
                                            onClick={() => onRow(item.id)}
                                            className="flex items-center px-6 py-4 focus:text-indigo-700 focus:outline-none"
                                        >
                                            {item[key]}
                                            {idx == 0 && item.deleted_at && (
                                                <Icon
                                                    iconNode={Trash2}
                                                    className="flex-shrink-0 w-3 h-3 ml-2 text-gray-400 fill-current"
                                                />
                                            )}
                                        </a>
                                    </td>
                                );
                            })}

                            <td className="w-px border-t">
                                {actions.map((action: any, key: number) => {
                                    return (
                                        <button
                                            key={key}
                                            className="px-4 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                                            title={action.title}
                                            onClick={() => action.action(item.id)}
                                        >
                                            <Icon
                                                iconNode={action.icon}
                                                className=""
                                            />
                                        </button>
                                    );
                                })}
                            </td>
                        </tr>
                    );
                })}
                {data.length === 0 && (
                    <tr>
                        <td
                            className="px-6 py-4 border-t"
                            colSpan={titles.length + 1}
                        >
                            No data found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};
