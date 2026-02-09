type ReposProps = {
    data: any;
  };

export default function Repos({data} : ReposProps){
    return <div>{data.message}</div>
}