const pb = {
  le: '<:_le:1312300864849051689>',
  me: '<:_me:1312300923523043328>',
  re: '<:_re:1312300980846727179>',
  lf: '<:_lf:1312301006377455646>',
  mf: '<:_mf:1312301040397189151>',
  rf: '<:_rf:1312301066594943007>',
};

function formatResults(upvotes = [], downvotes = []) {
  const totalVotes = upvotes.length + downvotes.length;
  const progressBarLength = 14;
  const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
  const emptySquares = progressBarLength - filledSquares || 0;

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