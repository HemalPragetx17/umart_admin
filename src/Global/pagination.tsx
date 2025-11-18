import {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
const Pagination = (props: any) => {
    const currentPage = props.currentPage;
    const [pages, setPages] = useState([]);
    const pagination = (c: any, m: any) => {
        var current = c,
            last = m,
            delta = 1,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || (i >= left && i < right)) {
                range.push(i);
            }
        }
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    };
    useEffect(() => {
        let data: any = pagination(
            currentPage,
            // 100,
            Math.ceil(props.totalRecords / props.pageLimit)
        );
        setPages(data);
    }, []);
    useEffect(() => {
        let data: any = pagination(
            currentPage,
            // 100,
            Math.ceil(props.totalRecords / props.pageLimit)
        );
        setPages(data);
    }, [currentPage]);
    useEffect(() => {
        let data: any = pagination(
            currentPage,
            // 100,
            Math.ceil(props.totalRecords / props.pageLimit)
        );
        setPages(data);
    }, [props.pageLimit]);
    useEffect(() => {
        let data: any = pagination(
            currentPage,
            // 100,
            Math.ceil(props.totalRecords / props.pageLimit)
        );
        setPages(data);
    }, [props.totalRecords]);
    return (
        <>
            <div className="row d-flex flex-wrap justify-content-between my-5">
                <div className="col-auto">
                    <Form.Select
                        size="lg"
                        onChange={(e: any) => {
                            props.handlePageLimit(e);
                        }}
                    >
                        <option selected={props.pageLimit === 10}>10</option>
                        <option selected={props.pageLimit === 20}>20</option>
                        <option selected={props.pageLimit === 30}>30</option>
                    </Form.Select>
                </div>
                <div className="d-flex align-items-center justify-content-end col">
                    <ul className="pagination">
                        <li className={clsx('page-item previous', pages[0] === currentPage ? 'disabled' : '')}>
                            <Link
                                to="#"
                                className="page-link"
                                onClick={() => {
                                    props.handlePreviousPage(currentPage);
                                }}
                            >
                                <i className="previous"></i>
                            </Link>
                        </li>
                        {pages.map((val: any) => {
                            return (
                                <>
                                    <li className={clsx('page-item', val === currentPage ? 'active' : '')}>
                                        <Link
                                            to="#"
                                            className={clsx('page-link', val === currentPage ? 'active' : '')}
                                            onClick={() => {
                                                props.handleCurrentPage(val);
                                            }}
                                        >
                                            {val}
                                        </Link>
                                    </li>
                                </>
                            );
                        })}
                        <li
                            className={clsx(
                                'page-item next',
                                pages[pages.length - 1] === currentPage ? 'disabled' : ''
                            )}
                        >
                            <Link
                                to="#"
                                className="page-link"
                                onClick={() => {
                                    props.handleNextPage(currentPage);
                                }}
                            >
                                <i className="next"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};
export default Pagination;
