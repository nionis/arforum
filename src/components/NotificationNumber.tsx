interface INotificationNumberProps {
  children?: any;
  value: number;
}

const NotificationNumber = ({ children, value }: INotificationNumberProps) => {
  return (
    <>
      <div className="container">
        {children}
        {value === 0 ? null : <span className="badge">{value}</span>}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .badge {
          padding: 1px 7px;
          border-radius: 50%;
          background: red;
          color: white;
          margin-left: 10px;
        }
      `}</style>
    </>
  );
};

export default NotificationNumber;
