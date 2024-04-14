const EmbedSketch = () => {
  const url = "https://openprocessing.org/sketch/2239445/embed/?plusEmbedHash=f328a82c&userID=421888&plusEmbedFullscreen=true&show=sketch"
  return (
    <div>
      <iframe
        src={url}
        width="650"
        height="650"
        title="Embedded Sketch"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default EmbedSketch;
