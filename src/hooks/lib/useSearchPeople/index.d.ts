export interface PeopleDataProps {
    name: string;
    email: string;
    avatar_url: string;
    sequence: string;
}
export interface Response {
    data: PeopleDataProps[];
}
export interface Options {
    size?: number;
    wait?: number;
    jwtToken?: string;
    useJwtToken?: boolean;
    suffix?: boolean;
}
export interface FetchParams extends Options {
    keyword: string;
    curPage: number;
}
export default function useSearchPeople(options?: Options): {
    data: PeopleDataProps[];
    search: (keyword: string) => void;
    loading: boolean;
    error: string | Error | undefined;
    fetchData(params: FetchParams): Promise<Response>;
};
