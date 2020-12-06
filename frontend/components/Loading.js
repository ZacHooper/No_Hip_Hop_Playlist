import { useLoading, Audio } from '@agney/react-loading';

const Loading = (props) => {
  const { containerProps, indicatorEl } = useLoading({
    loading: props.loading,
    indicator: <Audio width="50" />,
  });
  return (
    <div {...containerProps}>
      {indicatorEl}
    </div>
  )
}

export default Loading