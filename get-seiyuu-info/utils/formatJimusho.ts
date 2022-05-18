export function formatJimusho(string: string | null) {
  if (string) {
    switch (string.toLowerCase()) {
      case 'ARTSVISION'.toLowerCase():
        return 'ARTSVISION';
      case 'Early Wing'.toLowerCase():
        return 'EARLY WING';
      // case 'IAMAgency'.toLowerCase():
      // return 'IAM Agency';
      case "I'm Enterprise".toLowerCase():
        return "I'm Enterprise";
      case '青二事务所':
      case '青二Production'.toLowerCase():
        return '青二Production';
      // case 'AXLONE'.toLowerCase():
      case 'AXL-ONE'.toLowerCase():
        return 'AXL ONE';
      case 'ACROSS ENTERTAINMENT'.toLowerCase():
        return 'ACROSS ENTERTAINMENT';
      case 'Atomic Monkey'.toLowerCase():
        return 'Atomic Monkey';
      case 'Ability Soul Pro'.toLowerCase():
        return 'Ability Soul Pro';
      case 'Aptepro'.toLowerCase():
        return 'Aptepro';
      case 'amuleto':
        return 'amuleto';
      case 'Arise Project'.toLowerCase():
        return 'ARISE PROJECT';
      case 'INTENTION'.toLowerCase():
        return 'INTENTION';
      case '81 Produce'.toLowerCase():
      case '81Produce'.toLowerCase():
        return '81 Produce';
      // case 'Sigma Seven'.toLowerCase():
      // return 'SIGMA SEVEN'
      case 'Just Production'.toLowerCase():
      case 'Just Pro'.toLowerCase():
        return 'Just Production';
      case 'swallow':
        return 'Swallow';
      case '俳协':
        return '东京俳优生活协同组合';
      case 'PUGNUS'.toLowerCase():
        return 'PUGNUS';
      case 'WITH LINE'.toLowerCase():
        return 'WITH LINE';
      case '响HiBiKi'.toLowerCase():
        return '响 (HiBiKi)';
      case 'holypeak':
        return 'Holy Peak';
      case 'ミュージックレイン':
        return "Music Ray'n";
      case 'Link Plan'.toLowerCase():
        return 'LINK・PLAN';
      case '自由身':
      case '暂无':
        return '无';
      default:
        return string;
    }
  } else return null;
}
