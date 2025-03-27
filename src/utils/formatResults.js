const pb = {
  le: '<:_le:1346495833356636310>',
  me: '<:_me:1346495849764749322>',
  re: '<:_re:1346495859474563174>',
  lf: '<:_lf:1346495867112394772>',
  mf: '<:_mf:1346495873495859251>',
  rf: '<:_rf:1346495880286699673>',
};

function formatResults(upvotes = [], downvotes = []) {
  const totalVotes = upvotes.length + downvotes.length;
  const progressBarLength = 14;
  const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
  let emptySquares = progressBarLength - filledSquares || 0;

  if (!filledSquares && !emptySquares) {
    emptySquares = progressBarLength;
  }

  const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
  const downPercentage = (downvotes.length / totalVotes) * 100 || 0;

  const progressBar =
    (filledSquares ? pb.lf : pb.le) +
    (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
    (filledSquares === progressBarLength ? pb.rf : pb.re);

  const results = [];
  results.push(
    `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${downvotes.length
    } downvotes (${downPercentage.toFixed(1)}%)`
  );
  results.push(progressBar);

  return results.join('\n');
}

module.exports = formatResults;